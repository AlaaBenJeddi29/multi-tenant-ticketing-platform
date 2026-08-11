import { AppError } from "../../../lib/AppError.js";

import type {
  CreateAutomationRuleDto,
} from "../dto/create-automation-rule.dto.js";

import type {
  UpdateAutomationRuleDto,
} from "../dto/update-automation-rule.dto.js";

import type {
  ListAutomationRulesQuery,
} from "../dto/list-automation-rules.dto.js";

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