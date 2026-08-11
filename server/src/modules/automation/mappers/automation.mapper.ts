import type {
  AutomationRule,
} from "../../../generated/prisma/client.js";
import { buildMeta } from "../../../lib/pagination.js";
import type { PaginatedResponse } from "../../../lib/pagination.js";

export function toAutomationResponse(
  rule: AutomationRule
) {
  return {
    id: rule.id,

    name: rule.name,

    enabled: rule.enabled,

    trigger: rule.trigger,

    condition: rule.condition,

    conditionValue:
      rule.conditionValue,

    action: rule.action,

    actionValue:
      rule.actionValue,

    organizationId:
      rule.organizationId,

    createdAt:
      rule.createdAt,

    updatedAt:
      rule.updatedAt,
  };
}

export function toAutomationRulesResponse(
  rules: AutomationRule[]
) {
  return rules.map(
    toAutomationResponse
  );
}

export function toAutomationRulesListResponse({
  items,
  total,
  page,
  pageSize,
}: {
  items: AutomationRule[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedResponse<ReturnType<typeof toAutomationResponse>> {
  return {
    data: items.map(toAutomationResponse),
    meta: buildMeta(total, page, pageSize),
  };
}