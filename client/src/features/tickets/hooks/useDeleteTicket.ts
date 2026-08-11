import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTicket } from "../api/ticket.api";
import { ticketKeys } from "../api/ticket.queryKeys";

/**
 * Hook to delete a ticket
 * Invalidates all ticket queries on success
 */
export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}
