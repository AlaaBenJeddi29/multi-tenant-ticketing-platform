import { prisma } from "../../../lib/prisma.js";

import type {
  AutomationTrigger,
} from "../../../generated/prisma/client.js";

import { getSkipTake } from "../../../lib/pagination.js";

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

export async function findAutomationExecutions(
  organizationId: string,
  page: number,
  pageSize: number
) {
  const { skip, take } = getSkipTake(page, pageSize);

  const [items, total] = await Promise.all([
    prisma.automationExecution.findMany({
      where: {
        automationRule: {
          organizationId,
        },
      },
      include: {
        automationRule: {
          select: {
            name: true,
          },
        },
        ticket: {
          select: {
            ticketNumber: true,
            title: true,
          },
        },
      },
      orderBy: {
        executedAt: "desc",
      },
      skip,
      take,
    }),
    prisma.automationExecution.count({
      where: {
        automationRule: {
          organizationId,
        },
      },
    }),
  ]);

  return { items, total };
}