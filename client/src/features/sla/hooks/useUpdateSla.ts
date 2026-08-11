import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      // Invalidate all SLA queries to refetch lists and details
      queryClient.invalidateQueries({ queryKey: slaKeys.all });
    },
  });
}
