import { z } from "zod";

export const updateCommentSchema =
  z.object({
    content: z
      .string()
      .trim()
      .min(1)
      .max(5000),
  });

export type UpdateCommentDto =
  z.infer<
    typeof updateCommentSchema
  >;