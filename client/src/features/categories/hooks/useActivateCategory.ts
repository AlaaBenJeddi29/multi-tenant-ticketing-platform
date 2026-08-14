import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("Category activated.");
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to activate category.";
      toast.error(message);
    },
  });
}
