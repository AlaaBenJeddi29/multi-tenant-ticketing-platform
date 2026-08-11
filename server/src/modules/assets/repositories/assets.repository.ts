import { prisma } from "../../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";
import { getSkipTake } from "../../../lib/pagination.js";
import type { ListAssetsQuery } from "../dto/list-assets.dto.js";

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

export async function findAssets(
  organizationId: string,
  query: ListAssetsQuery
) {
  const where: Prisma.AssetWhereInput = {
    organizationId,
  };

  // Apply search filter (name or assetTag)
  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        assetTag: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Apply status filter
  if (query.status !== undefined) {
    where.status = query.status;
  }

  // Build orderBy
  const orderBy: Prisma.AssetOrderByWithRelationInput = {
    [query.sortBy]: query.sortOrder,
  };

  // Calculate pagination
  const { skip, take } = getSkipTake(query.page, query.pageSize);

  // Execute queries in parallel
  const [items, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      orderBy,
      skip,
      take,
      select: assetSelect,
    }),
    prisma.asset.count({ where }),
  ]);

  return { items, total };
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