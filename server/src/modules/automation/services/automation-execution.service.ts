import { prisma } from "../../../lib/prisma.js";

import {
  AutomationAction,
  TicketStatus,
} from "../../../generated/prisma/client.js";

import type { AutomationRule, Ticket } from "../../../generated/prisma/client.js";

import { createNewNotification } from "../../notifications/services/notification.service.js";

import { emailService } from "../../../lib/email/index.js";

import { updateTicket } from "../../tickets/repositories/ticket.repository.js";

export async function executeAutomationAction(
  ticket: Ticket,
  rule: AutomationRule
) {
  switch (rule.action) {
    case AutomationAction.ASSIGN_AGENT:
      return assignAgent(ticket, rule);

    case AutomationAction.CHANGE_STATUS:
      return changeStatus(ticket, rule);

    case AutomationAction.ADD_COMMENT:
      return addComment(ticket, rule);

    case AutomationAction.CHANGE_PRIORITY:
      return changePriority(ticket, rule);

    case AutomationAction.CLOSE_TICKET:
      return closeTicket(ticket);

    case AutomationAction.REOPEN_TICKET:
      return reopenTicket(ticket);

    case AutomationAction.SEND_NOTIFICATION:
      return sendNotification(ticket, rule);

    case AutomationAction.SEND_EMAIL:
      return sendEmail(ticket, rule);

    case AutomationAction.WEBHOOK:
      // Future milestone
      return;

    default:
      return;
  }
}

async function assignAgent(
  ticket: Ticket,
  rule: AutomationRule
) {
  if (!rule.actionValue) {
    console.error("ASSIGN_AGENT: actionValue is empty");
    return;
  }

  // Verify user exists, is active, and belongs to same organization
  const user = await prisma.user.findFirst({
    where: {
      id: rule.actionValue,
      organizationId: ticket.organizationId,
      isActive: true,
    },
  });

  if (!user) {
    console.error("ASSIGN_AGENT: User not found or inactive");
    return;
  }

  // Skip if already assigned to this agent
  if (ticket.assignedToId === rule.actionValue) {
    return;
  }

  await updateTicket(
    ticket.id,
    {
      assignedTo: {
        connect: {
          id: rule.actionValue,
        },
      },
    },
    true // triggeredByAutomation
  );

  // Create notification for the assigned agent
  await createNewNotification({
    userId: rule.actionValue,
    title: "Ticket Assigned to You",
    message: `Ticket #${ticket.ticketNumber}: ${ticket.title} has been assigned to you.`,
    relatedEntityType: "TICKET",
    relatedEntityId: ticket.id,
  });
}

async function changeStatus(
  ticket: Ticket,
  rule: AutomationRule
) {
  if (!rule.actionValue) {
    console.error("CHANGE_STATUS: actionValue is empty");
    return;
  }

  // Skip if already has this status
  if (ticket.status === rule.actionValue) {
    return;
  }

  await updateTicket(
    ticket.id,
    {
      status: rule.actionValue as TicketStatus,
    },
    true // triggeredByAutomation
  );
}

async function addComment(
  ticket: Ticket,
  rule: AutomationRule
) {
  console.log(`[Automation] ADD_COMMENT called for ticket ${ticket.id}, actionValue: ${rule.actionValue}`);
  
  if (!rule.actionValue) {
    console.error("ADD_COMMENT: actionValue is empty");
    return;
  }

  // Find an ORG_ADMIN to use as author
  const orgAdmin = await prisma.user.findFirst({
    where: {
      organizationId: ticket.organizationId,
      role: "ORG_ADMIN",
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  const authorId = orgAdmin?.id || ticket.createdById;
  console.log(`[Automation] ADD_COMMENT: Using authorId ${authorId}`);

  const comment = await prisma.ticketComment.create({
    data: {
      ticketId: ticket.id,
      content: rule.actionValue,
      authorId,
      isAutomated: true,
    },
  });
  
  console.log(`[Automation] ADD_COMMENT: Comment created successfully with id ${comment.id}`);
}

async function changePriority(
  ticket: Ticket,
  rule: AutomationRule
) {
  if (!rule.actionValue) {
    console.error("CHANGE_PRIORITY: actionValue is empty");
    return;
  }

  // Skip if already has this priority
  if (ticket.priorityId === rule.actionValue) {
    return;
  }

  // Verify priority exists and belongs to same organization
  const priority = await prisma.priority.findFirst({
    where: {
      id: rule.actionValue,
      organizationId: ticket.organizationId,
      isActive: true,
    },
  });

  if (!priority) {
    console.error("CHANGE_PRIORITY: Priority not found or inactive");
    return;
  }

  await updateTicket(
    ticket.id,
    {
      priority: {
        connect: {
          id: rule.actionValue,
        },
      },
    },
    true // triggeredByAutomation
  );
}

async function closeTicket(ticket: Ticket) {
  // Skip if already closed
  if (ticket.status === TicketStatus.CLOSED) {
    return;
  }

  await updateTicket(
    ticket.id,
    {
      status: TicketStatus.CLOSED,
      resolvedAt: new Date(),
    },
    true // triggeredByAutomation
  );
}

async function reopenTicket(ticket: Ticket) {
  // Skip if not closed
  if (ticket.status !== TicketStatus.CLOSED) {
    return;
  }

  await updateTicket(
    ticket.id,
    {
      status: TicketStatus.NEW,
      resolvedAt: null,
    },
    true // triggeredByAutomation
  );
}

async function sendNotification(
  ticket: Ticket,
  rule: AutomationRule
) {
  if (!rule.actionValue) {
    console.error("SEND_NOTIFICATION: actionValue is empty");
    return;
  }

  // If ticket has an assigned agent, notify them
  if (ticket.assignedToId) {
    await createNewNotification({
      userId: ticket.assignedToId,
      title: "Automation Alert",
      message: rule.actionValue,
    });
    return;
  }

  // If no agent is assigned, notify all ORG_ADMINs in the organization
  const orgAdmins = await prisma.user.findMany({
    where: {
      organizationId: ticket.organizationId,
      role: "ORG_ADMIN",
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  // Create notification for each ORG_ADMIN
  for (const admin of orgAdmins) {
    await createNewNotification({
      userId: admin.id,
      title: "Automation Alert",
      message: rule.actionValue,
    });
  }
}

async function sendEmail(
  ticket: Ticket,
  rule: AutomationRule
) {
  try {
    const requester = await prisma.requester.findUnique({
      where: { id: ticket.requesterId },
      select: { email: true },
    });

    const to = requester?.email;
    if (!to) {
      console.warn("SEND_EMAIL: No requester email found");
      return;
    }

    const subject = `Update on your ticket #${ticket.ticketNumber}`;
    const body = rule.actionValue || "The status of your ticket has been updated.";

    await emailService.send(to, subject, body);
  } catch (error) {
    // Email failure should not break other actions
    console.error("SEND_EMAIL: Failed to send email", error);
  }
}