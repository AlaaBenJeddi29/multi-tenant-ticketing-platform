import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { deleteAsset } from "../api/asset.api";
import { assetKeys } from "../api/asset.queryKeys";

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAsset(id),
    onSuccess: () => {
      toast.success("Asset deleted.");
      queryClient.invalidateQueries({ queryKey: assetKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to delete asset.";
      toast.error(message);
    },
  });
}
