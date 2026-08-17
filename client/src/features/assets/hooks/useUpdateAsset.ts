import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { updateAsset } from "../api/asset.api";
import { assetKeys } from "../api/asset.queryKeys";

export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: {
      name?: string;
      assetTag?: string;
      manufacturer?: string;
      model?: string;
      serialNumber?: string;
      purchaseDate?: string;
      warrantyUntil?: string;
      location?: string;
      notes?: string;
      status?: "ACTIVE" | "IN_MAINTENANCE" | "RETIRED";
    } }) => updateAsset(id, input),
    onSuccess: () => {
      toast.success("Asset updated.");
      queryClient.invalidateQueries({ queryKey: assetKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to update asset.";
      toast.error(message);
    },
  });
}
