import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicket } from "../api/ticket.api";
import { ticketKeys } from "../api/ticket.queryKeys";
import type { CreateTicketInput } from "../types/ticket.types";

/**
 * Hook to create a new ticket
 * Invalidates all ticket queries on success
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => createTicket(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
  });
}
