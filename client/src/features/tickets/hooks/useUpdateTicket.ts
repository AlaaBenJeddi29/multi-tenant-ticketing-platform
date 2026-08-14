import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("Ticket updated.");
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to update ticket.";
      toast.error(message);
    },
  });
}
