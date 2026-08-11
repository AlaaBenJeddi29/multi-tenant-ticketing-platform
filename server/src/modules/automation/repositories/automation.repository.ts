import { prisma } from "../../../lib/prisma.js";

import type {
  Prisma,
  AutomationTrigger,
} from "../../../generated/prisma/client.js";

import { getSkipTake } from "../../../lib/pagination.js";
import type { ListAutomationRulesQuery } from "../dto/list-automation-rules.dto.js";

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

export async function findAutomationRules(
  organizationId: string,
  query: ListAutomationRulesQuery
) {
  const where: Prisma.AutomationRuleWhereInput = {
    organizationId,
  };

  // Apply search filter (name)
  if (query.search) {
    where.name = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  // Apply trigger filter
  if (query.trigger !== undefined) {
    where.trigger = query.trigger;
  }

  // Apply enabled filter
  if (query.enabled !== undefined) {
    where.enabled = query.enabled;
  }

  // Build orderBy
  const orderBy: Prisma.AutomationRuleOrderByWithRelationInput = {
    [query.sortBy]: query.sortOrder,
  };

  // Calculate pagination
  const { skip, take } = getSkipTake(query.page, query.pageSize);

  // Execute queries in parallel
  const [items, total] = await Promise.all([
    prisma.automationRule.findMany({
      where,
      orderBy,
      skip,
      take,
      select: automationRuleSelect,
    }),
    prisma.automationRule.count({ where }),
  ]);

  return { items, total };
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