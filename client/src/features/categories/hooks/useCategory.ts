import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "../api/category.api";
import { categoryKeys } from "../api/category.queryKeys";

/**
 * Hook to fetch a single category by ID
 */
export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
}
