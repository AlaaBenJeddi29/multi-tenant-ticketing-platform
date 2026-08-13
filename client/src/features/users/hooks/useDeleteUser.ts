import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
