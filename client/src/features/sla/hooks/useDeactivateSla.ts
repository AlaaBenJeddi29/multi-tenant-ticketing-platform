import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { deactivateSla } from "../api/sla.api";
import { slaKeys } from "../api/sla.queryKeys";

/**
 * Hook to deactivate an SLA
 * Invalidates all SLA queries on success
 */
export function useDeactivateSla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateSla(id),
    onSuccess: () => {
      toast.success("SLA deactivated.");
      queryClient.invalidateQueries({ queryKey: slaKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to deactivate SLA.";
      toast.error(message);
    },
  });
}
