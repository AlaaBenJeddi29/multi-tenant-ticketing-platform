import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import type { PaginatedResponse } from "@/types/pagination.types";

/**
 * Minimal priority type for dropdowns
 * Full priorities feature will be built later
 */
export interface Priority {
  id: string;
  name: string;
  color: string;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isActive: boolean;
}

/**
 * Hook to fetch priorities list
 * Minimal implementation for tickets - full feature later
 */
export function usePriorities(params: { isActive?: boolean; pageSize?: number } = {}) {
  return useQuery({
    queryKey: ["priorities", "list", params],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Priority>>("/priorities", {
        params: { isActive: params.isActive, pageSize: params.pageSize || 100 },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
}
