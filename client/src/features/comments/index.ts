// Types
export type {
  Comment,
  CommentWithAuthor,
  CreateCommentInput,
  CommentListParams,
  CommentsResponse,
} from "./types/comment.types";

// API
export * from "./api/comment.api";
export { commentKeys } from "./api/comment.queryKeys";

// Hooks
export { useCommentsByTicket } from "./hooks/useCommentsByTicket";
export { useCreateComment } from "./hooks/useCreateComment";
export { useDeleteComment } from "./hooks/useDeleteComment";

// Components
export { CommentThread } from "./components/CommentThread";

// Schemas
export { createCommentSchema } from "./schemas/comment.schema";
export type { CreateCommentFormData } from "./schemas/comment.schema";
