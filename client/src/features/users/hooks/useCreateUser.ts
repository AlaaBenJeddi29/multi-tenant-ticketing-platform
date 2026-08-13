import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../api/user.api";
import { userKeys } from "../api/user.queryKeys";
import type { CreateUserInput } from "../types/user.types";

/**
 * Hook to create a new user
 * Invalidates all user queries on success
 * ORG_ADMIN only
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
