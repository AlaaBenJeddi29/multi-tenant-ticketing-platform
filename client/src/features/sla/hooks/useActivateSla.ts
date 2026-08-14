import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { activateSla } from "../api/sla.api";
import { slaKeys } from "../api/sla.queryKeys";

/**
 * Hook to activate an SLA
 * Invalidates all SLA queries on success
 */
export function useActivateSla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateSla(id),
    onSuccess: () => {
      toast.success("SLA activated.");
      queryClient.invalidateQueries({ queryKey: slaKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to activate SLA.";
      toast.error(message);
    },
  });
}
