import { api } from "@/api/client";
import type {
  Comment,
  CommentsResponse,
  CommentListParams,
  CreateCommentInput,
} from "../types/comment.types";

/**
 * Get paginated list of comments for a ticket
 * Sorted oldest-first (as per backend default)
 */
export async function getCommentsByTicket(
  ticketId: string,
  params: CommentListParams
): Promise<CommentsResponse> {
  const response = await api.get<CommentsResponse>(
    `/comments/ticket/${ticketId}`,
    { params }
  );
  return response.data;
}

/**
 * Create a new comment on a ticket
 * Available to any authenticated role
 */
export async function createComment(
  ticketId: string,
  input: CreateCommentInput
): Promise<Comment> {
  const response = await api.post<Comment>(
    `/comments/ticket/${ticketId}`,
    input
  );
  return response.data;
}

/**
 * Delete a comment
 * Available to any authenticated role
 * 
 * Note: Backend does not enforce author-only deletion.
 * This is a potential security gap worth flagging.
 */
export async function deleteComment(id: string): Promise<void> {
  await api.delete(`/comments/${id}`);
}
