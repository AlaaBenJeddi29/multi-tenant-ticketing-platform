import type { PaginatedResponse } from "@/types/pagination.types";

export interface Priority {
  id: string;
  name: string;
  level: string;
  color: string;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PriorityListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  isActive?: boolean;
}

export type PrioritiesResponse = PaginatedResponse<Priority>;
