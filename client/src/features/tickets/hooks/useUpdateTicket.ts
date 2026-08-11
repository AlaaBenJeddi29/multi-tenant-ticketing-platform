import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicket } from "../api/ticket.api";
import { ticketKeys } from "../api/ticket.queryKeys";
import type { UpdateTicketInput } from "../types/ticket.types";

/**
 * Hook to update an existing ticket
 * Invalidates all ticket queries on success
 */
export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTicketInput }) =>
      updateTicket(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}
