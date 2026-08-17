import { useQuery } from "@tanstack/react-query";
import { getAssets } from "../api/asset.api";
import { assetKeys } from "../api/asset.queryKeys";
import type { AssetListParams } from "../types/asset.types";

export function useAssets(params: AssetListParams = {}) {
  return useQuery({
    queryKey: assetKeys.list(params),
    queryFn: () => getAssets(params),
    placeholderData: (previousData) => previousData,
  });
}
