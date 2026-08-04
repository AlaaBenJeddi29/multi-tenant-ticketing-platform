import { prisma } from "../../../lib/prisma.js";
import {
  AutomationAction,
  AutomationCondition,
  TicketStatus,
} from "../../../generated/prisma/client.js";
import type {
  AutomationRule,
  Ticket,
} from "../../../generated/prisma/client.js";

export async function executeAutomationRules(
  ticketId: string,
  trigger: AutomationRule["trigger"]
) {
  /*
   * Load ticket
   */
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      priority: true,
      category: true,
      requester: true,
      assignedTo: true,
    },
  });

  if (!ticket) {
    return;
  }

  /*
   * Load organization rules
   */
  const rules = await prisma.automationRule.findMany({
    where: {
      organizationId: ticket.organizationId,
      enabled: true,
      trigger,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  /*
   * Execute rules
   */
  for (const rule of rules) {
    const passed = evaluateCondition(ticket, rule);

    if (!passed) {
      continue;
    }

    await executeAction(ticket, rule);
  }
}

/* ===========================================================
   CONDITIONS
=========================================================== */

function evaluateCondition(ticket: Ticket, rule: AutomationRule) {
  switch (rule.condition) {
    case AutomationCondition.ALWAYS:
      return true;

    case AutomationCondition.STATUS_IS:
      return ticket.status === rule.conditionValue;

    case AutomationCondition.PRIORITY_IS:
      return ticket.priorityId === rule.conditionValue;

    case AutomationCondition.UNASSIGNED:
      return ticket.assignedToId === null;

    case AutomationCondition.RESPONSE_BREACHED:
      return ticket.responseBreached;

    case AutomationCondition.RESOLUTION_BREACHED:
      return ticket.resolutionBreached;

    default:
      return false;
  }
}

/* ===========================================================
   ACTIONS
=========================================================== */

async function executeAction(ticket: Ticket, rule: AutomationRule) {
  switch (rule.action) {
    /*
     * Assign ticket
     */
    case AutomationAction.ASSIGN_AGENT:
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
      break;

    /*
     * Change status
     */
    case AutomationAction.CHANGE_STATUS:
      if (!rule.actionValue) return;

      await prisma.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          status: rule.actionValue as TicketStatus,
        },
      });
      break;

    /*
     * Add internal note
     */
    case AutomationAction.ADD_COMMENT:
      if (!rule.actionValue) return;

      await prisma.ticketComment.create({
        data: {
          ticketId: ticket.id,
          content: rule.actionValue,
          authorId: ticket.createdById,
        },
      });
      break;

    /*
     * Change priority
     */
    case AutomationAction.CHANGE_PRIORITY:
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
      break;

    /*
     * Close ticket
     */
    case AutomationAction.CLOSE_TICKET:
      await prisma.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          status: TicketStatus.CLOSED,
          resolvedAt: new Date(),
        },
      });
      break;

    /*
     * Reopen ticket
     */
    case AutomationAction.REOPEN_TICKET:
      await prisma.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          status: TicketStatus.IN_PROGRESS,
        },
      });
      break;

    /*
     * Future actions
     */
    case AutomationAction.SEND_EMAIL:
      // TODO
      break;

    case AutomationAction.SEND_NOTIFICATION:
      // TODO
      break;

    case AutomationAction.WEBHOOK:
      // TODO
      break;

    default:
      break;
  }
}