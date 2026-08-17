import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { updateRequester } from "../api/requester.api";
import { requesterKeys } from "../api/requester.queryKeys";

export function useUpdateRequester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      company?: string;
      notes?: string;
    } }) => updateRequester(id, input),
    onSuccess: () => {
      toast.success("Requester updated.");
      queryClient.invalidateQueries({ queryKey: requesterKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to update requester.";
      toast.error(message);
    },
  });
}
