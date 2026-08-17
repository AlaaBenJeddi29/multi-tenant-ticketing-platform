import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { deletePriority } from "../api/priority.api";
import { priorityKeys } from "../api/priority.queryKeys";

export function useDeletePriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePriority(id),
    onSuccess: () => {
      toast.success("Priority deleted.");
      queryClient.invalidateQueries({ queryKey: priorityKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to delete priority.";
      toast.error(message);
    },
  });
}
