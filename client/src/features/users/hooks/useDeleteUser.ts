import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { deleteUser } from "../api/user.api";
import { userKeys } from "../api/user.queryKeys";

/**
 * Hook to delete a user
 * Invalidates all user queries on success
 * ORG_ADMIN only
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted.");
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to delete user.";
      toast.error(message);
    },
  });
}
