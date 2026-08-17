import type { PaginatedResponse } from "@/types/pagination.types";

/**
 * Requester entity from the backend
 */
export interface Requester {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for creating a new requester
 */
export interface CreateRequesterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}

/**
 * Input for updating an existing requester
 */
export interface UpdateRequesterInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

/**
 * Query parameters for listing requesters
 */
export interface RequesterListParams {
  page?: number;
  pageSize?: number;
  sortBy?: "lastName" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  isActive?: boolean;
}

/**
 * Paginated response for requesters list
 */
export type RequestersResponse = PaginatedResponse<Requester>;
