import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAutomationRule } from "../api/automation.api";
import { automationKeys } from "../api/automation.queryKeys";

/**
 * Hook to delete an automation rule
 * Invalidates all automation queries on success
 * ORG_ADMIN only
 */
export function useDeleteAutomationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAutomationRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
    },
  });
}
