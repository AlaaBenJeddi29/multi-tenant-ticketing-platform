import { z } from "zod";
import { paginationQuerySchema } from "../../../lib/pagination.js";
import { AssetStatus } from "../../../generated/prisma/client.js";

export const listAssetsQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .optional(),

  status: z
    .nativeEnum(AssetStatus)
    .optional(),

  sortBy: z
    .enum(["name", "status", "createdAt"])
    .default("createdAt"),
});

export type ListAssetsQuery = z.infer<typeof listAssetsQuerySchema>;
