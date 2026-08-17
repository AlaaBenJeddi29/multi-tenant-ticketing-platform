import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { createRequester } from "../api/requester.api";
import { requesterKeys } from "../api/requester.queryKeys";

export function useCreateRequester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      company?: string;
      notes?: string;
    }) => createRequester(input),
    onSuccess: () => {
      toast.success("Requester created.");
      queryClient.invalidateQueries({ queryKey: requesterKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to create requester.";
      toast.error(message);
    },
  });
}
