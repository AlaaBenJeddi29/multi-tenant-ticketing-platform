import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { activatePriority } from "../api/priority.api";
import { priorityKeys } from "../api/priority.queryKeys";

export function useActivatePriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activatePriority(id),
    onSuccess: () => {
      toast.success("Priority activated.");
      queryClient.invalidateQueries({ queryKey: priorityKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to activate priority.";
      toast.error(message);
    },
  });
}
