import { z } from "zod";
import { paginationQuerySchema } from "../../../lib/pagination.js";

export const listCategoriesQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .optional(),

  isActive: z.coerce
    .boolean()
    .optional(),

  sortBy: z
    .enum(["name", "createdAt", "updatedAt"])
    .default("createdAt"),
});

export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;
