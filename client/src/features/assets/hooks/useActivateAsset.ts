import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { activateAsset } from "../api/asset.api";
import { assetKeys } from "../api/asset.queryKeys";

export function useActivateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateAsset(id),
    onSuccess: () => {
      toast.success("Asset activated.");
      queryClient.invalidateQueries({ queryKey: assetKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to activate asset.";
      toast.error(message);
    },
  });
}
