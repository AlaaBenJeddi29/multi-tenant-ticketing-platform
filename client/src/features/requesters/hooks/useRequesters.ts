import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import type { PaginatedResponse } from "@/types/pagination.types";

/**
 * Minimal requester type for dropdowns
 * Full requesters feature will be built later
 */
export interface Requester {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  isActive: boolean;
}

/**
 * Minimal asset type for dropdowns
 * Full assets feature will be built later
 */
export interface Asset {
  id: string;
  name: string;
  assetTag: string;
  status: "ACTIVE" | "IN_MAINTENANCE" | "RETIRED";
}

/**
 * Hook to fetch requesters list
 * Minimal implementation for tickets - full feature later
 */
export function useRequesters(params: { isActive?: boolean; pageSize?: number } = {}) {
  return useQuery({
    queryKey: ["requesters", "list", params],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Requester>>("/requesters", {
        params: { isActive: params.isActive, pageSize: params.pageSize || 100 },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch assets list
 * Minimal implementation for tickets - full feature later
 */
export function useAssets(params: { status?: string; pageSize?: number } = {}) {
  return useQuery({
    queryKey: ["assets", "list", params],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Asset>>("/assets", {
        params: { status: params.status, pageSize: params.pageSize || 100 },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
}
