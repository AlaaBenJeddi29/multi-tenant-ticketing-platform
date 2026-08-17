import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { maintenanceAsset } from "../api/asset.api";
import { assetKeys } from "../api/asset.queryKeys";

export function useMaintenanceAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => maintenanceAsset(id),
    onSuccess: () => {
      toast.success("Asset set to maintenance.");
      queryClient.invalidateQueries({ queryKey: assetKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to set asset to maintenance.";
      toast.error(message);
    },
  });
}
