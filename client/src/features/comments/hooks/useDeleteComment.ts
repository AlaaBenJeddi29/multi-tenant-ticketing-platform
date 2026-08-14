import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { deleteComment } from "../api/comment.api";
import { ticketKeys } from "@/features/tickets/api/ticket.queryKeys";

/**
 * Hook to delete a comment
 * Invalidates the ticket detail query to refresh the embedded comments list
 * 
 * Note: Backend allows any authenticated user to delete any comment,
 * not just the author. This is a potential security gap worth flagging.
 */
export function useDeleteComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      toast.success("Comment deleted.");
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to delete comment.";
      toast.error(message);
    },
  });
}
