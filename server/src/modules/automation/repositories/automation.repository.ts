import { prisma } from "../../../lib/prisma.js";

import type {
  Prisma,
  AutomationTrigger,
} from "../../../generated/prisma/client.js";

const automationRuleSelect = {
  id: true,

  name: true,

  enabled: true,

  trigger: true,

  condition: true,

  conditionValue: true,

  action: true,

  actionValue: true,

  organizationId: true,

  createdAt: true,

  updatedAt: true,
} satisfies Prisma.AutomationRuleSelect;

export function findAutomationRules(
  organizationId: string
) {
  return prisma.automationRule.findMany({
    where: {
      organizationId,
      enabled: true,
    },

    orderBy: {
      createdAt: "asc",
    },

    select: automationRuleSelect,
  });
}

export function findAutomationRulesByTrigger(
  organizationId: string,
  trigger: AutomationTrigger
) {
  return prisma.automationRule.findMany({
    where: {
      organizationId,
      enabled: true,
      trigger,
    },

    orderBy: {
      createdAt: "asc",
    },

    select: automationRuleSelect,
  });
}

export function findAutomationRuleById(
  id: string,
  organizationId: string
) {
  return prisma.automationRule.findFirst({
    where: {
      id,
      organizationId,
    },

    select: automationRuleSelect,
  });
}

export function createAutomationRule(
  data: Prisma.AutomationRuleCreateInput
) {
  return prisma.automationRule.create({
    data,

    select: automationRuleSelect,
  });
}

export function updateAutomationRule(
  id: string,
  data: Prisma.AutomationRuleUpdateInput
) {
  return prisma.automationRule.update({
    where: {
      id,
    },

    data,

    select: automationRuleSelect,
  });
}

export function deleteAutomationRule(
  id: string
) {
  return prisma.automationRule.delete({
    where: {
      id,
    },

    select: {
      id: true,
    },
  });
}