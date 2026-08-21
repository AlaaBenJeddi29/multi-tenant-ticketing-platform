import { AppError } from "../../../lib/AppError.js";
import { prisma } from "../../../lib/prisma.js";

import type {
  CreateAutomationRuleDto,
} from "../dto/create-automation-rule.dto.js";

import type {
  UpdateAutomationRuleDto,
} from "../dto/update-automation-rule.dto.js";

import type {
  ListAutomationRulesQuery,
} from "../dto/list-automation-rules.dto.js";

import type { AutomationTrigger } from "../../../generated/prisma/client.js";

import {
  createAutomationRule,
  deleteAutomationRule,
  findAutomationRuleById,
  findAutomationRules,
  updateAutomationRule,
} from "../repositories/automation.repository.js";

import {
  toAutomationResponse,
  toAutomationRulesListResponse,
} from "../mappers/automation.mapper.js";

import { executeAutomationAction } from "./automation-execution.service.js";

export async function getAutomationRules(
  organizationId: string,
  query: ListAutomationRulesQuery
) {
  const { items, total } =
    await findAutomationRules(
      organizationId,
      query
    );

  return toAutomationRulesListResponse({
    items,
    total,
    page: query.page,
    pageSize: query.pageSize,
  });
}

export async function getAutomationRuleById(
  id: string,
  organizationId: string
) {
  const rule =
    await findAutomationRuleById(
      id,
      organizationId
    );

  if (!rule) {
    throw new AppError(
      404,
      "Automation rule not found."
    );
  }

  return toAutomationResponse(
    rule
  );
}

export async function createNewAutomationRule(
  dto: CreateAutomationRuleDto,
  organizationId: string
) {
  const rule =
    await createAutomationRule({
      name: dto.name,

      enabled:
        dto.enabled ?? true,

      trigger:
        dto.trigger,

      condition:
        dto.condition,

      conditionValue:
        dto.conditionValue,

      action:
        dto.action,

      actionValue:
        dto.actionValue,

      organization: {
        connect: {
          id: organizationId,
        },
      },
    });

  return toAutomationResponse(
    rule
  );
}

export async function editAutomationRule(
  id: string,
  organizationId: string,
  dto: UpdateAutomationRuleDto
) {
  await getAutomationRuleById(
    id,
    organizationId
  );

  const data: Parameters<
    typeof updateAutomationRule
  >[1] = {};

  if (dto.name !== undefined) {
    data.name = dto.name;
  }

  if (
    dto.enabled !== undefined
  ) {
    data.enabled =
      dto.enabled;
  }

  if (
    dto.trigger !== undefined
  ) {
    data.trigger =
      dto.trigger;
  }

  if (
    dto.condition !==
    undefined
  ) {
    data.condition =
      dto.condition;
  }

  if (
    dto.conditionValue !==
    undefined
  ) {
    data.conditionValue =
      dto.conditionValue;
  }

  if (
    dto.action !== undefined
  ) {
    data.action =
      dto.action;
  }

  if (
    dto.actionValue !==
    undefined
  ) {
    data.actionValue =
      dto.actionValue;
  }

  const rule =
    await updateAutomationRule(
      id,
      data
    );

  return toAutomationResponse(
    rule
  );
}

export async function activateAutomationRule(
  id: string,
  organizationId: string
) {
  await getAutomationRuleById(
    id,
    organizationId
  );

  const rule =
    await updateAutomationRule(
      id,
      {
        enabled: true,
      }
    );

  return toAutomationResponse(
    rule
  );
}

export async function deactivateAutomationRule(
  id: string,
  organizationId: string
) {
  await getAutomationRuleById(
    id,
    organizationId
  );

  const rule =
    await updateAutomationRule(
      id,
      {
        enabled: false,
      }
    );

  return toAutomationResponse(
    rule
  );
}

export async function removeAutomationRule(
  id: string,
  organizationId: string
) {
  await getAutomationRuleById(
    id,
    organizationId
  );

  await deleteAutomationRule(
    id
  );
}

export async function evaluateTrigger(
  trigger: AutomationTrigger,
  ticketId: string,
  organizationId: string
) {
  console.log(`[Automation] evaluateTrigger called: trigger=${trigger}, ticketId=${ticketId}, organizationId=${organizationId}`);

  // Fetch the ticket with all necessary relations
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      priority: true,
      category: true,
      requester: true,
      assignedTo: true,
    },
  });

  if (!ticket) {
    console.log(`[Automation] Ticket not found: ${ticketId}`);
    return;
  }

  // Fetch active rules for this organization and trigger
  const rules = await prisma.automationRule.findMany({
    where: {
      organizationId,
      trigger,
      enabled: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log(`[Automation] Found ${rules.length} active rules for trigger ${trigger}`);

  // Evaluate and execute each rule
  for (const rule of rules) {
    try {
      console.log(`[Automation] Evaluating rule ${rule.id}: ${rule.name}, action=${rule.action}`);
      const conditionPassed = evaluateCondition(ticket, rule);

      if (!conditionPassed) {
        console.log(`[Automation] Condition failed for rule ${rule.id}`);
        continue;
      }

      console.log(`[Automation] Condition passed, executing action for rule ${rule.id}`);
      // Execute the action
      await executeAutomationAction(ticket, rule);
      console.log(`[Automation] Action executed successfully for rule ${rule.id}`);
    } catch (error) {
      // Log error but continue with other rules
      console.error(
        `Failed to execute automation rule ${rule.id}:`,
        error
      );
    }
  }
}

function evaluateCondition(
  ticket: any,
  rule: any
): boolean {
  switch (rule.condition) {
    case "ALWAYS":
      return true;

    case "STATUS_IS":
      return ticket.status === rule.conditionValue;

    case "PRIORITY_IS":
      return ticket.priorityId === rule.conditionValue;

    case "UNASSIGNED":
      return ticket.assignedToId === null;

    case "RESPONSE_BREACHED":
      return ticket.responseBreached === true;

    case "RESOLUTION_BREACHED":
      return ticket.resolutionBreached === true;

    default:
      return false;
  }
}