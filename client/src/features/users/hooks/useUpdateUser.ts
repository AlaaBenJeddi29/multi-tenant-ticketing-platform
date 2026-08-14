import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("User updated.");
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to update user.";
      toast.error(message);
    },
  });
}
