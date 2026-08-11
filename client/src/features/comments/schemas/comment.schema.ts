import { z } from "zod";

/**
 * Validation schema for creating a comment
 */
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment must be 5000 characters or less")
    .trim(),
});

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
