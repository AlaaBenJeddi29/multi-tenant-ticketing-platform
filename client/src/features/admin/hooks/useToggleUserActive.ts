import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toggleUserActive } from "../api/admin.api";
import { adminKeys } from "../api/admin.queryKeys";

export function useToggleUserActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      toggleUserActive(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      toast.success("User status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user status");
    },
  });
}
