import type {
  AutomationRule,
} from "../../../generated/prisma/client.js";

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