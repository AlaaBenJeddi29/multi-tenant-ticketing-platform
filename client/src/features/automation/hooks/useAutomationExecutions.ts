import { useQuery } from "@tanstack/react-query";
import { getAutomationExecutions } from "../api/automation.api";
import { automationKeys } from "../api/automation.queryKeys";

/**
 * Hook to fetch automation execution history
 * ORG_ADMIN only
 */
export function useAutomationExecutions(params: { page: number; pageSize: number }) {
  return useQuery({
    queryKey: automationKeys.executions(params),
    queryFn: () => getAutomationExecutions(params),
  });
}
