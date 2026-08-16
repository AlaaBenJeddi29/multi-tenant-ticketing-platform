import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { claimTicket } from "../api/ticket.api";
import { ticketKeys } from "../api/ticket.queryKeys";
import type { Ticket } from "../types/ticket.types";

/**
 * Hook to claim a ticket for the current user
 * Optimistically updates the cached detail view for instant feedback
 * Invalidates all queries on success for consistency
 */
export function useClaimTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => claimTicket(id),
    
    // Optimistic update for instant UI feedback
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ticketKeys.detail(id) });

      // Snapshot previous value
      const previousTicket = queryClient.getQueryData<Ticket>(ticketKeys.detail(id));

      // Optimistically update cache - we don't know the user details yet, so we'll just refetch
      return { previousTicket };
    },

    // Rollback on error
    onError: (error: AxiosError<{ message?: string }>, id, context) => {
      const message = error.response?.data?.message || "Failed to claim ticket.";
      toast.error(message);
      if (context?.previousTicket) {
        queryClient.setQueryData(ticketKeys.detail(id), context.previousTicket);
      }
    },

    // Refetch on success to get full updated data
    onSuccess: () => {
      toast.success("Ticket claimed");
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}
