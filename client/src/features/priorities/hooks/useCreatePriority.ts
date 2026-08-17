import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { createPriority } from "../api/priority.api";
import { priorityKeys } from "../api/priority.queryKeys";

export function useCreatePriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; level: string; color: string }) => createPriority(input),
    onSuccess: () => {
      toast.success("Priority created.");
      queryClient.invalidateQueries({ queryKey: priorityKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to create priority.";
      toast.error(message);
    },
  });
}
