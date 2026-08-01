import { AppError } from "../../../lib/AppError.js";

import type {
  CreateAssetDto,
} from "../dto/create-asset.dto.js";

import type {
  UpdateAssetDto,
} from "../dto/update-asset.dto.js";

import {
  createAsset,
  deleteAsset,
  findAssetById,
  findAssetByTag,
  findAssets,
  updateAsset,
} from "../repositories/assets.repository.js";

import {
  toAssetResponse,
  toAssetsResponse,
} from "../mappers/asset.mapper.js";

export async function getAssets(
  organizationId: string
) {
  const assets =
    await findAssets(organizationId);

  return toAssetsResponse(assets);
}

export async function getAssetById(
  assetId: string,
  organizationId: string
) {
  const asset =
    await findAssetById(
      assetId,
      organizationId
    );

  if (!asset) {
    throw new AppError(
      404,
      "Asset not found."
    );
  }

  return toAssetResponse(asset);
}

export async function createNewAsset(
  dto: CreateAssetDto,
  organizationId: string
) {
  const existing =
    await findAssetByTag(
      dto.assetTag,
      organizationId
    );

  if (existing) {
    throw new AppError(
      409,
      "An asset with this tag already exists."
    );
  }

  const asset =
    await createAsset({
      name: dto.name,
      assetTag: dto.assetTag,
      manufacturer: dto.manufacturer,
      model: dto.model,
      serialNumber: dto.serialNumber,
      purchaseDate: dto.purchaseDate,
      warrantyUntil: dto.warrantyUntil,
      location: dto.location,
      notes: dto.notes,

      organization: {
        connect: {
          id: organizationId,
        },
      },
    });

  return toAssetResponse(asset);
}

export async function editAsset(
  assetId: string,
  organizationId: string,
  dto: UpdateAssetDto
) {
  await getAssetById(
    assetId,
    organizationId
  );

  if (dto.assetTag) {
    const existing =
      await findAssetByTag(
        dto.assetTag,
        organizationId
      );

    if (
      existing &&
      existing.id !== assetId
    ) {
      throw new AppError(
        409,
        "Asset tag already exists."
      );
    }
  }

  const asset =
    await updateAsset(
      assetId,
      dto
    );

  return toAssetResponse(asset);
}

export function activateAsset(
  assetId: string,
  organizationId: string
) {
  return changeAssetStatus(
    assetId,
    organizationId,
    "ACTIVE"
  );
}

export function maintenanceAsset(
  assetId: string,
  organizationId: string
) {
  return changeAssetStatus(
    assetId,
    organizationId,
    "IN_MAINTENANCE"
  );
}
export function retireAsset(
  assetId: string,
  organizationId: string
) {
  return changeAssetStatus(
    assetId,
    organizationId,
    "RETIRED"
  );
}
async function changeAssetStatus(
  assetId: string,
  organizationId: string,
  status: "ACTIVE" | "IN_MAINTENANCE" | "RETIRED"
) {
  await getAssetById(
    assetId,
    organizationId
  );

  const asset = await updateAsset(
    assetId,
    {
      status,
    }
  );

  return toAssetResponse(asset);
}


export async function removeAsset(
  assetId: string,
  organizationId: string
) {
  await getAssetById(
    assetId,
    organizationId
  );

  await deleteAsset(assetId);
}