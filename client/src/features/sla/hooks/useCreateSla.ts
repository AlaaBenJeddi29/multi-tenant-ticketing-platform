import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { createSla } from "../api/sla.api";
import { slaKeys } from "../api/sla.queryKeys";
import type { CreateSlaInput } from "../types/sla.types";

/**
 * Hook to create a new SLA
 * Invalidates all SLA queries on success
 */
export function useCreateSla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSlaInput) => createSla(input),
    onSuccess: () => {
      toast.success("SLA created.");
      queryClient.invalidateQueries({ queryKey: slaKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to create SLA.";
      toast.error(message);
    },
  });
}
