import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { activateRequester } from "../api/requester.api";
import { requesterKeys } from "../api/requester.queryKeys";

export function useActivateRequester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateRequester(id),
    onSuccess: () => {
      toast.success("Requester activated.");
      queryClient.invalidateQueries({ queryKey: requesterKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to activate requester.";
      toast.error(message);
    },
  });
}
