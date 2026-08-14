import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { deleteSla } from "../api/sla.api";
import { slaKeys } from "../api/sla.queryKeys";

/**
 * Hook to delete an SLA
 * Invalidates all SLA queries on success
 */
export function useDeleteSla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSla(id),
    onSuccess: () => {
      toast.success("SLA deleted.");
      queryClient.invalidateQueries({ queryKey: slaKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to delete SLA.";
      toast.error(message);
    },
  });
}
