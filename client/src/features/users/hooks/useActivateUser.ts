import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateUser } from "../api/user.api";
import { userKeys } from "../api/user.queryKeys";

/**
 * Hook to activate a user
 * Invalidates all user queries on success
 * ORG_ADMIN only
 */
export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
