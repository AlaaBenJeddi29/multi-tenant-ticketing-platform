import type { CommentListParams } from "../types/comment.types";

/**
 * Hierarchical query keys for comments
 * 
 * Structure:
 * - commentKeys.all: Invalidates everything
 * - commentKeys.lists(): Invalidates all lists
 * - commentKeys.ticketComments(ticketId, params): Specific ticket's comments
 */
export const commentKeys = {
  all: ["comments"] as const,
  
  lists: () => [...commentKeys.all, "list"] as const,
  
  ticketComments: (ticketId: string, params: CommentListParams) =>
    [...commentKeys.lists(), ticketId, params] as const,
};
