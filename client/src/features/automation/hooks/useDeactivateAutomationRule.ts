import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateAutomationRule } from "../api/automation.api";
import { automationKeys } from "../api/automation.queryKeys";

/**
 * Hook to deactivate an automation rule
 * Invalidates all automation queries on success
 * ORG_ADMIN only
 */
export function useDeactivateAutomationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateAutomationRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
    },
  });
}
