import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api/category.api";
import { categoryKeys } from "../api/category.queryKeys";
import type { CreateCategoryInput } from "../types/category.types";

/**
 * Hook to create a new category
 * Invalidates all category queries on success
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => createCategory(input),
    onSuccess: () => {
      // Invalidate all category queries to refetch lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
