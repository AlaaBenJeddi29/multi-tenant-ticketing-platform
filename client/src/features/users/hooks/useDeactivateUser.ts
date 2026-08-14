import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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
      toast.success("User deactivated.");
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to deactivate user.";
      toast.error(message);
    },
  });
}
