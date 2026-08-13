import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateUser } from "../api/user.api";
import { userKeys } from "../api/user.queryKeys";

/**
 * Hook to deactivate a user
 * Invalidates all user queries on success
 * ORG_ADMIN only
 */
export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
