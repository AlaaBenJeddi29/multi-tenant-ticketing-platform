import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("Comment added.");
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to add comment.";
      toast.error(message);
    },
  });
}
