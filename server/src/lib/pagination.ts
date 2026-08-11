import { z } from "zod";

/**
 * Shared pagination query schema with sane defaults
 */
export const paginationQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/**
 * Pagination metadata for responses
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Standard paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Build pagination metadata
 */
export function buildMeta(
  total: number,
  page: number,
  pageSize: number
): PaginationMeta {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Calculate skip and take values for Prisma queries
 */
export function getSkipTake(page: number, pageSize: number) {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}
