import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { deactivateRequester } from "../api/requester.api";
import { requesterKeys } from "../api/requester.queryKeys";

export function useDeactivateRequester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateRequester(id),
    onSuccess: () => {
      toast.success("Requester deactivated.");
      queryClient.invalidateQueries({ queryKey: requesterKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to deactivate requester.";
      toast.error(message);
    },
  });
}
