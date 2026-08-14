import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("User created.");
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to create user.";
      toast.error(message);
    },
  });
}
