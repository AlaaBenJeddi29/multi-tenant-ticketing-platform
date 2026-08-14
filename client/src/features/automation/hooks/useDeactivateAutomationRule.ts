import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("Automation rule deactivated.");
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to deactivate automation rule.";
      toast.error(message);
    },
  });
}
