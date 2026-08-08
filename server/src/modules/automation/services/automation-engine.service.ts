import { prisma } from "../../../lib/prisma.js";

import {
  AutomationCondition,
} from "../../../generated/prisma/client.js";

import type {
  AutomationRule,
  Ticket,
} from "../../../generated/prisma/client.js";

import {
  executeAutomationAction,
} from "./automation-execution.service.js";

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
   * Load enabled rules for this organization + trigger
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
   * Evaluate and execute rules
   */
  for (const rule of rules) {
    const passed = evaluateCondition(
      ticket,
      rule
    );

    if (!passed) {
      continue;
    }

    await executeAutomationAction(
      ticket,
      rule
    );
  }
}

/* ===========================================================
   CONDITIONS
=========================================================== */

function evaluateCondition(
  ticket: Ticket,
  rule: AutomationRule
) {
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