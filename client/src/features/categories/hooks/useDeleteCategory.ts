import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../api/category.api";
import { categoryKeys } from "../api/category.queryKeys";

/**
 * Hook to delete a category
 * Invalidates all category queries on success
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
