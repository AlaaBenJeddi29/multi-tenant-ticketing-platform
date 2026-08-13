import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateAutomationRule } from "../api/automation.api";
import { automationKeys } from "../api/automation.queryKeys";

/**
 * Hook to activate an automation rule
 * Invalidates all automation queries on success
 * ORG_ADMIN only
 */
export function useActivateAutomationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateAutomationRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
    },
  });
}
