import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { retireAsset } from "../api/asset.api";
import { assetKeys } from "../api/asset.queryKeys";

export function useRetireAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => retireAsset(id),
    onSuccess: () => {
      toast.success("Asset retired.");
      queryClient.invalidateQueries({ queryKey: assetKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to retire asset.";
      toast.error(message);
    },
  });
}
