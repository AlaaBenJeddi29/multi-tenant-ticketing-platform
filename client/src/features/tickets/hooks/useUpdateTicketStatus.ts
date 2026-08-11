import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicketStatus } from "../api/ticket.api";
import { ticketKeys } from "../api/ticket.queryKeys";
import type { Ticket, UpdateTicketStatusInput } from "../types/ticket.types";

/**
 * Hook to update ticket status
 * Optimistically updates the cached detail view for instant feedback
 * Invalidates all queries on success for consistency
 */
export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTicketStatusInput }) =>
      updateTicketStatus(id, input),
    
    // Optimistic update for instant UI feedback
    onMutate: async ({ id, input }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ticketKeys.detail(id) });

      // Snapshot previous value
      const previousTicket = queryClient.getQueryData<Ticket>(ticketKeys.detail(id));

      // Optimistically update cache
      if (previousTicket) {
        queryClient.setQueryData<Ticket>(ticketKeys.detail(id), {
          ...previousTicket,
          status: input.status,
        });
      }

      return { previousTicket };
    },

    // Rollback on error
    onError: (_err, { id }, context) => {
      if (context?.previousTicket) {
        queryClient.setQueryData(ticketKeys.detail(id), context.previousTicket);
      }
    },

    // Refetch on success to get full updated data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}
