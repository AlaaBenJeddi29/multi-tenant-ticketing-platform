import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      queryClient.invalidateQueries({ queryKey: slaKeys.all });
    },
  });
}
