import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { deactivatePriority } from "../api/priority.api";
import { priorityKeys } from "../api/priority.queryKeys";

export function useDeactivatePriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivatePriority(id),
    onSuccess: () => {
      toast.success("Priority deactivated.");
      queryClient.invalidateQueries({ queryKey: priorityKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to deactivate priority.";
      toast.error(message);
    },
  });
}
