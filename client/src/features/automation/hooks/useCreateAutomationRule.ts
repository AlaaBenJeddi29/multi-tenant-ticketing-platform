import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAutomationRule } from "../api/automation.api";
import { automationKeys } from "../api/automation.queryKeys";
import type { CreateAutomationRuleInput } from "../types/automation.types";

/**
 * Hook to create a new automation rule
 * Invalidates all automation queries on success
 * ORG_ADMIN only
 */
export function useCreateAutomationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAutomationRuleInput) => createAutomationRule(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
    },
  });
}
