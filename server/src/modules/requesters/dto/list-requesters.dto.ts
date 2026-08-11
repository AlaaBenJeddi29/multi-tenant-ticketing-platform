import { z } from "zod";
import { paginationQuerySchema } from "../../../lib/pagination.js";

export const listRequestersQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .optional(),

  isActive: z.coerce
    .boolean()
    .optional(),

  sortBy: z
    .enum(["lastName", "createdAt"])
    .default("createdAt"),
});

export type ListRequestersQuery = z.infer<typeof listRequestersQuerySchema>;
