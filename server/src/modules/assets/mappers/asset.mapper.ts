import type { Asset } from "../../../generated/prisma/client.js";
import { buildMeta } from "../../../lib/pagination.js";
import type { PaginatedResponse } from "../../../lib/pagination.js";

export function toAssetResponse(
  asset: Asset
) {
  return {
    id: asset.id,
    name: asset.name,
    assetTag: asset.assetTag,
    manufacturer: asset.manufacturer,
    model: asset.model,
    serialNumber: asset.serialNumber,
    purchaseDate: asset.purchaseDate,
    warrantyUntil: asset.warrantyUntil,
    location: asset.location,
    notes: asset.notes,
    status: asset.status,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
  };
}

export function toAssetsResponse(
  assets: Asset[]
) {
  return assets.map(toAssetResponse);
}

export function toAssetsListResponse({
  items,
  total,
  page,
  pageSize,
}: {
  items: Asset[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedResponse<ReturnType<typeof toAssetResponse>> {
  return {
    data: items.map(toAssetResponse),
    meta: buildMeta(total, page, pageSize),
  };
}