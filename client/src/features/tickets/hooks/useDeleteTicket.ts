import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("Ticket deleted.");
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to delete ticket.";
      toast.error(message);
    },
  });
}
