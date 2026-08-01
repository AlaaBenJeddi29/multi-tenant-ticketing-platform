import type { Asset } from "../../../generated/prisma/client.js";

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