import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { updatePriority } from "../api/priority.api";
import { priorityKeys } from "../api/priority.queryKeys";

export function useUpdatePriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: { name?: string; level?: string; color?: string; isActive?: boolean } }) =>
      updatePriority(id, input),
    onSuccess: () => {
      toast.success("Priority updated.");
      queryClient.invalidateQueries({ queryKey: priorityKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to update priority.";
      toast.error(message);
    },
  });
}
