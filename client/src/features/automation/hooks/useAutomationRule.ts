import { useQuery } from "@tanstack/react-query";
import { getAutomationRuleById } from "../api/automation.api";
import { automationKeys } from "../api/automation.queryKeys";

/**
 * Hook to fetch a single automation rule by ID
 * ORG_ADMIN only
 */
export function useAutomationRule(id: string) {
  return useQuery({
    queryKey: automationKeys.detail(id),
    queryFn: () => getAutomationRuleById(id),
    enabled: !!id,
  });
}
