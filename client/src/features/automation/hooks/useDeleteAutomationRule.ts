import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("Automation rule deleted.");
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to delete automation rule.";
      toast.error(message);
    },
  });
}
