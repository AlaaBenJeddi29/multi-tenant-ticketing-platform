import type { AssetListParams } from "../types/asset.types";

export const assetKeys = {
  all: ["assets"] as const,
  list: (params: AssetListParams) => [...assetKeys.all, "list", params] as const,
  detail: (id: string) => [...assetKeys.all, "detail", id] as const,
};
