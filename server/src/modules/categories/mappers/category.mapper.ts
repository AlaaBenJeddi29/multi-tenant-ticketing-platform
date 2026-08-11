import { buildMeta } from "../../../lib/pagination.js";
import type { PaginatedResponse } from "../../../lib/pagination.js";

export function toCategoryResponse(
  category: any
) {
  return {
    id: category.id,
    name: category.name,
    description:
      category.description,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function toCategoriesResponse(
  categories: any[]
) {
  return categories.map(
    toCategoryResponse
  );
}

export function toCategoriesListResponse({
  items,
  total,
  page,
  pageSize,
}: {
  items: any[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedResponse<ReturnType<typeof toCategoryResponse>> {
  return {
    data: items.map(toCategoryResponse),
    meta: buildMeta(total, page, pageSize),
  };
}