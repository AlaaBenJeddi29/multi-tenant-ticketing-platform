import { prisma } from "../../../lib/prisma.js";

import {
  AutomationAction,
  TicketStatus,
} from "../../../generated/prisma/client.js";

import type { AutomationRule, Ticket } from "../../../generated/prisma/client.js";

import { createNewNotification } from "../../notifications/services/notification.service.js";

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
      // Future milestone
      return;

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
  if (!rule.actionValue) return;

  await prisma.ticket.update({
    where: {
      id: ticket.id,
    },
    data: {
      assignedTo: {
        connect: {
          id: rule.actionValue,
        },
      },
    },
  });
}

async function changeStatus(
  ticket: Ticket,
  rule: AutomationRule
) {
  if (!rule.actionValue) return;

  await prisma.ticket.update({
    where: {
      id: ticket.id,
    },
    data: {
      status: rule.actionValue as TicketStatus,
    },
  });
}

async function addComment(
  ticket: Ticket,
  rule: AutomationRule
) {
  if (!rule.actionValue) return;

  await prisma.ticketComment.create({
    data: {
      ticketId: ticket.id,
      content: rule.actionValue,
      authorId: ticket.createdById,
    },
  });
}

async function changePriority(
  ticket: Ticket,
  rule: AutomationRule
) {
  if (!rule.actionValue) return;

  await prisma.ticket.update({
    where: {
      id: ticket.id,
    },
    data: {
      priority: {
        connect: {
          id: rule.actionValue,
        },
      },
    },
  });
}

async function closeTicket(ticket: Ticket) {
  await prisma.ticket.update({
    where: {
      id: ticket.id,
    },
    data: {
      status: TicketStatus.CLOSED,
      resolvedAt: new Date(),
    },
  });
}

async function reopenTicket(ticket: Ticket) {
  await prisma.ticket.update({
    where: {
      id: ticket.id,
    },
    data: {
      status: TicketStatus.IN_PROGRESS,
      resolvedAt: null,
    },
  });
}

async function sendNotification(
  ticket: Ticket,
  rule: AutomationRule
) {
  if (!rule.actionValue) return;

  if (!ticket.assignedToId) return;

  await createNewNotification({
    userId: ticket.assignedToId,
    title: "Ticket Automation",
    message: rule.actionValue,
  });
}