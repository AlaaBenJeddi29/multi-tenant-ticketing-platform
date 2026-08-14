import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("Category updated.");
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to update category.";
      toast.error(message);
    },
  });
}
