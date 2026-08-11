import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateCategory } from "../api/category.api";
import { categoryKeys } from "../api/category.queryKeys";

/**
 * Hook to activate a category
 * Invalidates all category queries on success
 */
export function useActivateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
