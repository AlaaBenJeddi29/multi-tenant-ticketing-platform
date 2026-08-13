import { useQuery } from "@tanstack/react-query";
import { getAutomationRules } from "../api/automation.api";
import { automationKeys } from "../api/automation.queryKeys";
import type { AutomationRuleListParams } from "../types/automation.types";

/**
 * Hook to fetch paginated list of automation rules
 * Uses placeholderData to prevent loading flash during pagination
 * ORG_ADMIN only
 */
export function useAutomationRules(params: AutomationRuleListParams) {
  return useQuery({
    queryKey: automationKeys.list(params),
    queryFn: () => getAutomationRules(params),
    placeholderData: (previousData) => previousData,
  });
}
