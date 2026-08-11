import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSla } from "../api/sla.api";
import { slaKeys } from "../api/sla.queryKeys";
import type { CreateSlaInput } from "../types/sla.types";

/**
 * Hook to create a new SLA
 * Invalidates all SLA queries on success
 */
export function useCreateSla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSlaInput) => createSla(input),
    onSuccess: () => {
      // Invalidate all SLA queries to refetch lists
      queryClient.invalidateQueries({ queryKey: slaKeys.all });
    },
  });
}
