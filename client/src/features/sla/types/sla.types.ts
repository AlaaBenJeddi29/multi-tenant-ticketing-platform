import type { PaginatedResponse } from "@/types/pagination.types";

/**
 * SLA entity from the backend
 */
export interface Sla {
  id: string;
  name: string;
  priorityId: string;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for creating a new SLA
 */
export interface CreateSlaInput {
  name: string;
  priorityId: string;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
}

/**
 * Input for updating an existing SLA
 */
export interface UpdateSlaInput {
  name?: string;
  responseTimeMinutes?: number;
  resolutionTimeMinutes?: number;
}

/**
 * Query parameters for listing SLAs
 */
export interface SlaListParams {
  page?: number;
  pageSize?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  isActive?: boolean;
}

/**
 * Paginated response for SLAs list
 */
export type SlasResponse = PaginatedResponse<Sla>;
