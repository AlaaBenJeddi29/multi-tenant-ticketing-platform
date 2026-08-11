import { z } from "zod";
import { paginationQuerySchema } from "../../../lib/pagination.js";
import { PriorityLevel } from "../../../generated/prisma/client.js";

export const listPrioritiesQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .optional(),

  level: z
    .nativeEnum(PriorityLevel)
    .optional(),

  isActive: z.coerce
    .boolean()
    .optional(),

  sortBy: z
    .enum(["name", "level", "createdAt"])
    .default("createdAt"),
});

export type ListPrioritiesQuery = z.infer<typeof listPrioritiesQuerySchema>;
