import { z } from "zod";
import { paginationQuerySchema } from "../../../lib/pagination.js";

export const listSlasQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .optional(),

  isActive: z.coerce
    .boolean()
    .optional(),

  sortBy: z
    .enum(["name", "createdAt"])
    .default("createdAt"),
});

export type ListSlasQuery = z.infer<typeof listSlasQuerySchema>;
