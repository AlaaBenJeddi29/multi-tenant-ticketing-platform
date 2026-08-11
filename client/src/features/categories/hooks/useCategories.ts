import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/category.api";
import { categoryKeys } from "../api/category.queryKeys";
import type { CategoryListParams } from "../types/category.types";

/**
 * Hook to fetch paginated list of categories
 * Uses keepPreviousData to prevent loading flash during pagination
 */
export function useCategories(params: CategoryListParams) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => getCategories(params),
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
}
