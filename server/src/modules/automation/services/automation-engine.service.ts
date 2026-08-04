import type {
  AutomationRule,
  Ticket,
} from "../../../generated/prisma/client.js";

import {
  findAutomationRulesByTrigger,
} from "../repositories/automation.repository.js";

import {
  updateTicket,
} from "../../tickets/repositories/ticket.repository.js";

type TicketWithOrganization =
  Pick<
    Ticket,
    | "id"
    | "organizationId"
    | "status"
    | "priorityId"
    | "assignedToId"
  >;

export async function executeAutomationTrigger(
  trigger: AutomationRule["trigger"],
  ticket: TicketWithOrganization
) {
  const rules =
    await findAutomationRulesByTrigger(
      ticket.organizationId,
      trigger
    );

  if (!rules.length) {
    return;
  }

  for (const rule of rules) {
    const passed =
      evaluateCondition(
        rule,
        ticket
      );

    if (!passed) {
      continue;
    }

    await executeAction(
      rule,
      ticket
    );
  }
}

function evaluateCondition(
  rule: Pick<
    AutomationRule,
    "condition" | "conditionValue"
  >,
  ticket: TicketWithOrganization
) {
  switch (rule.condition) {
    case "ALWAYS":
      return true;

    case "STATUS_IS":
      return (
        ticket.status ===
        rule.conditionValue
      );

    case "PRIORITY_IS":
      return (
        ticket.priorityId ===
        rule.conditionValue
      );

    case "UNASSIGNED":
      return (
        ticket.assignedToId ===
        null
      );

    default:
      return false;
  }
}

async function executeAction(
  rule: Pick<
    AutomationRule,
    "action" | "actionValue"
  >,
  ticket: TicketWithOrganization
) {
  switch (rule.action) {
    case "ASSIGN_AGENT":
      if (!rule.actionValue) {
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
        }
      );

      break;

    case "CHANGE_STATUS":
      if (!rule.actionValue) {
        return;
      }

      await updateTicket(
        ticket.id,
        {
          status:
            rule.actionValue as Ticket["status"],
        }
      );

      break;

    case "DO_NOTHING":
      break;

    default:
      break;
  }
}