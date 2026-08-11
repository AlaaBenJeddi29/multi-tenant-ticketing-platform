import type { CategoryListParams } from "../types/category.types";

/**
 * Hierarchical query keys for categories
 * 
 * Structure:
 * - categoryKeys.all: Invalidates everything
 * - categoryKeys.lists(): Invalidates all lists
 * - categoryKeys.list(params): Specific list with filters
 * - categoryKeys.details(): Invalidates all details
 * - categoryKeys.detail(id): Specific category detail
 */
export const categoryKeys = {
  all: ["categories"] as const,
  
  lists: () => [...categoryKeys.all, "list"] as const,
  
  list: (params: CategoryListParams) =>
    [...categoryKeys.lists(), params] as const,
  
  details: () => [...categoryKeys.all, "detail"] as const,
  
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};
