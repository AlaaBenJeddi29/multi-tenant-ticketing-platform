import { api } from "@/api/client";
import type { AssetListParams, AssetsResponse, Asset } from "../types/asset.types";

export async function getAssets(params: AssetListParams): Promise<AssetsResponse> {
  const { data } = await api.get<AssetsResponse>("/assets", { params });
  return data;
}

export async function getAsset(id: string): Promise<Asset> {
  const { data } = await api.get<Asset>(`/assets/${id}`);
  return data;
}

export async function createAsset(data: {
  name: string;
  assetTag: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyUntil?: string;
  location?: string;
  notes?: string;
}): Promise<Asset> {
  const { data: response } = await api.post<Asset>("/assets", data);
  return response;
}

export async function updateAsset(id: string, data: {
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
}): Promise<Asset> {
  const { data: response } = await api.put<Asset>(`/assets/${id}`, data);
  return response;
}

export async function activateAsset(id: string): Promise<Asset> {
  const { data } = await api.patch<Asset>(`/assets/${id}/activate`);
  return data;
}

export async function maintenanceAsset(id: string): Promise<Asset> {
  const { data } = await api.patch<Asset>(`/assets/${id}/maintenance`);
  return data;
}

export async function retireAsset(id: string): Promise<Asset> {
  const { data } = await api.patch<Asset>(`/assets/${id}/retire`);
  return data;
}

export async function deleteAsset(id: string): Promise<void> {
  await api.delete(`/assets/${id}`);
}
