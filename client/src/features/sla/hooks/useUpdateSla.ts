import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { updateSla } from "../api/sla.api";
import { slaKeys } from "../api/sla.queryKeys";
import type { UpdateSlaInput } from "../types/sla.types";

/**
 * Hook to update an existing SLA
 * Invalidates all SLA queries on success
 */
export function useUpdateSla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSlaInput }) =>
      updateSla(id, input),
    onSuccess: () => {
      toast.success("SLA updated.");
      queryClient.invalidateQueries({ queryKey: slaKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to update SLA.";
      toast.error(message);
    },
  });
}
