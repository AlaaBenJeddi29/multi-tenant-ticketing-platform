import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../api/user.api";
import { userKeys } from "../api/user.queryKeys";
import type { UpdateUserInput } from "../types/user.types";

/**
 * Hook to update an existing user
 * Invalidates all user queries on success
 * ORG_ADMIN only
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      updateUser(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
