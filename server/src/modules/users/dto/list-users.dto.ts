import { z } from "zod";
import { paginationQuerySchema } from "../../../lib/pagination.js";
import { Role } from "../../../generated/prisma/client.js";

export const listUsersQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .optional(),

  role: z
    .nativeEnum(Role)
    .optional(),

  isActive: z.coerce
    .boolean()
    .optional(),

  sortBy: z
    .enum(["lastName", "createdAt"])
    .default("createdAt"),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
