import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { createAsset } from "../api/asset.api";
import { assetKeys } from "../api/asset.queryKeys";

export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      name: string;
      assetTag: string;
      manufacturer?: string;
      model?: string;
      serialNumber?: string;
      purchaseDate?: string;
      warrantyUntil?: string;
      location?: string;
      notes?: string;
    }) => createAsset(input),
    onSuccess: () => {
      toast.success("Asset created.");
      queryClient.invalidateQueries({ queryKey: assetKeys.all });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to create asset.";
      toast.error(message);
    },
  });
}
