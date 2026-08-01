import { prisma } from "../../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";

const assetSelect = {
  id: true,
  name: true,
  assetTag: true,
  manufacturer: true,
  model: true,
  serialNumber: true,
  purchaseDate: true,
  warrantyUntil: true,
  location: true,
  notes: true,
  status: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AssetSelect;

export function findAssets(
  organizationId: string
) {
  return prisma.asset.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: assetSelect,
  });
}

export function findAssetById(
  id: string,
  organizationId: string
) {
  return prisma.asset.findFirst({
    where: {
      id,
      organizationId,
    },
    select: assetSelect,
  });
}

export function findAssetByTag(
  assetTag: string,
  organizationId: string
) {
  return prisma.asset.findFirst({
    where: {
      assetTag,
      organizationId,
    },
    select: assetSelect,
  });
}

export function createAsset(
  data: Prisma.AssetCreateInput
) {
  return prisma.asset.create({
    data,
    select: assetSelect,
  });
}

export function updateAsset(
  id: string,
  data: Prisma.AssetUpdateInput
) {
  return prisma.asset.update({
    where: {
      id,
    },
    data,
    select: assetSelect,
  });
}

export function deleteAsset(
  id: string
) {
  return prisma.asset.delete({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });
}