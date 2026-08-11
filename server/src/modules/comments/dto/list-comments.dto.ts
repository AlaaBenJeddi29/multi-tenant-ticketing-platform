import { z } from "zod";
import { paginationQuerySchema } from "../../../lib/pagination.js";

// Comments only have pagination, sortBy is fixed to createdAt ascending
export const listCommentsQuerySchema = paginationQuerySchema
  .omit({ sortOrder: true })
  .extend({
    // sortBy and sortOrder are fixed for comments (oldest first for thread)
    sortBy: z.literal("createdAt").default("createdAt"),
    sortOrder: z.literal("asc").default("asc"),
  });

export type ListCommentsQuery = z.infer<typeof listCommentsQuerySchema>;
