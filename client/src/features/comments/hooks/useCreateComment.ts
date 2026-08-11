import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api/comment.api";
import { ticketKeys } from "@/features/tickets/api/ticket.queryKeys";
import type { CreateCommentInput } from "../types/comment.types";

/**
 * Hook to create a new comment on a ticket
 * Invalidates the ticket detail query to refresh the embedded comments list
 */
export function useCreateComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCommentInput) => createComment(ticketId, input),
    onSuccess: () => {
      // Invalidate ticket detail to refresh the embedded comments array
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
    },
  });
}
