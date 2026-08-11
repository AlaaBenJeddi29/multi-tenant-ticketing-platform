import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../api/category.api";
import { categoryKeys } from "../api/category.queryKeys";
import type { UpdateCategoryInput } from "../types/category.types";

/**
 * Hook to update an existing category
 * Invalidates all category queries on success
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      updateCategory(id, input),
    onSuccess: () => {
      // Invalidate all category queries to refetch lists and details
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
