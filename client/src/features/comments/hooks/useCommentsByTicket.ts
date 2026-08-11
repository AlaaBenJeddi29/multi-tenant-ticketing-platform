import { useQuery } from "@tanstack/react-query";
import { getCommentsByTicket } from "../api/comment.api";
import { commentKeys } from "../api/comment.queryKeys";
import type { CommentListParams } from "../types/comment.types";

/**
 * Hook to fetch paginated list of comments for a ticket
 * 
 * Note: For displaying comments in TicketDetailPage, prefer using
 * ticket.comments from useTicket() as it includes author details.
 * This hook is for standalone/lazy-loaded comment threads.
 */
export function useCommentsByTicket(
  ticketId: string,
  params: CommentListParams
) {
  return useQuery({
    queryKey: commentKeys.ticketComments(ticketId, params),
    queryFn: () => getCommentsByTicket(ticketId, params),
    placeholderData: (previousData) => previousData,
  });
}
