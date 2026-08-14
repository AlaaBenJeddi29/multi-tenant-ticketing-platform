import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { updateAutomationRule } from "../api/automation.api";
import { automationKeys } from "../api/automation.queryKeys";
import type { UpdateAutomationRuleInput } from "../types/automation.types";

/**
 * Hook to update an existing automation rule
 * Invalidates all automation queries on success
 * ORG_ADMIN only
 */
export function useUpdateAutomationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAutomationRuleInput }) =>
      updateAutomationRule(id, input),
    onSuccess: () => {
      toast.success("Automation rule updated.");
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to update automation rule.";
      toast.error(message);
    },
  });
}
