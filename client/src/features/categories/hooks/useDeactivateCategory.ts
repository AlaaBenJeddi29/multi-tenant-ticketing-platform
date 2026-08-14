import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { deactivateCategory } from "../api/category.api";
import { categoryKeys } from "../api/category.queryKeys";

/**
 * Hook to deactivate a category
 * Invalidates all category queries on success
 */
export function useDeactivateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateCategory(id),
    onSuccess: () => {
      toast.success("Category deactivated.");
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to deactivate category.";
      toast.error(message);
    },
  });
}
