import type { PaginatedResponse } from "@/types/pagination.types";

/**
 * Asset status enum
 */
export type AssetStatus = "ACTIVE" | "IN_MAINTENANCE" | "RETIRED";

/**
 * Asset entity from the backend
 */
export interface Asset {
  id: string;
  name: string;
  assetTag: string;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  purchaseDate: string | null;
  warrantyUntil: string | null;
  location: string | null;
  notes: string | null;
  status: AssetStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for creating a new asset
 */
export interface CreateAssetInput {
  name: string;
  assetTag: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyUntil?: string;
  location?: string;
  notes?: string;
}

/**
 * Input for updating an existing asset
 */
export interface UpdateAssetInput {
  name?: string;
  assetTag?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyUntil?: string;
  location?: string;
  notes?: string;
  status?: AssetStatus;
}

/**
 * Query parameters for listing assets
 */
export interface AssetListParams {
  page?: number;
  pageSize?: number;
  sortBy?: "name" | "status" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: AssetStatus;
}

/**
 * Paginated response for assets list
 */
export type AssetsResponse = PaginatedResponse<Asset>;
