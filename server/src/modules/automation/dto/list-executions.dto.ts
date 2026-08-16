import { z } from "zod";

export const listExecutionsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type ListExecutionsQuery = z.infer<typeof listExecutionsQuerySchema>;
