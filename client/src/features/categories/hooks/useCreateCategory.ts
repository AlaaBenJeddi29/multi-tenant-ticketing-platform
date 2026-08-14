import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("Category created.");
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to create category.";
      toast.error(message);
    },
  });
}
