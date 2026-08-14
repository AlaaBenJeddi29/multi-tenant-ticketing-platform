import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("User activated.");
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to activate user.";
      toast.error(message);
    },
  });
}
