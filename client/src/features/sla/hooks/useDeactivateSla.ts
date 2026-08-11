import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      queryClient.invalidateQueries({ queryKey: slaKeys.all });
    },
  });
}
