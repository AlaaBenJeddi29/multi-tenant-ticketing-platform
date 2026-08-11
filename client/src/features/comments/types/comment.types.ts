import type { PaginatedResponse } from "@/types/pagination.types";

/**
 * Comment entity from the API
 * Note: This is the bare shape from /api/comments endpoints
 */
export interface Comment {
  id: string;
  content: string;
  ticketId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Comment with author details (from ticket.comments)
 * This is the enriched shape returned in ticket detail responses
 */
export interface CommentWithAuthor {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

/**
 * Input for creating a new comment
 */
export interface CreateCommentInput {
  content: string;
}

/**
 * Query parameters for listing comments
 */
export interface CommentListParams {
  page?: number;
  pageSize?: number;
}

/**
 * Paginated response for comments list
 */
export type CommentsResponse = PaginatedResponse<Comment>;
