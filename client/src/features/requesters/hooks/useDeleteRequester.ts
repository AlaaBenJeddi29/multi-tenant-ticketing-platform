import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { deleteRequester } from "../api/requester.api";
import { requesterKeys } from "../api/requester.queryKeys";

export function useDeleteRequester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRequester(id),
    onSuccess: () => {
      toast.success("Requester deleted.");
      queryClient.invalidateQueries({ queryKey: requesterKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to delete requester.";
      toast.error(message);
    },
  });
}
