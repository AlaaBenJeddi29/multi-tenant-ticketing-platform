import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("Automation rule activated.");
      queryClient.invalidateQueries({ queryKey: automationKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to activate automation rule.";
      toast.error(message);
    },
  });
}
