import { prisma } from "../../../lib/prisma.js";

import type {
  AutomationTrigger,
} from "../../../generated/prisma/client.js";

export function findAutomationExecution(
  ticketId: string,
  automationRuleId: string,
  trigger: AutomationTrigger
) {
  return prisma.automationExecution.findUnique({
    where: {
      ticketId_automationRuleId_trigger: {
        ticketId,
        automationRuleId,
        trigger,
      },
    },
  });
}

export function createAutomationExecution(
  ticketId: string,
  automationRuleId: string,
  trigger: AutomationTrigger
) {
  return prisma.automationExecution.create({
    data: {
      ticketId,
      automationRuleId,
      trigger,
    },
  });
}