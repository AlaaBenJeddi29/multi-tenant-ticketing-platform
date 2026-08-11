import { api } from "@/api/client";
import type { PaginatedResponse } from "@/types/pagination.types";

/**
 * Minimal user type for dropdowns (full user feature in Phase 6)
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "AGENT";
  isActive: boolean;
}

export interface UserListParams {
  page?: number;
  pageSize?: number;
  sortBy?: "lastName" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  role?: "SUPER_ADMIN" | "ORG_ADMIN" | "AGENT";
  isActive?: boolean;
}

export type UsersResponse = PaginatedResponse<User>;

/**
 * Get paginated list of users
 */
export async function getUsers(params: UserListParams): Promise<UsersResponse> {
  const response = await api.get<UsersResponse>("/users", { params });
  return response.data;
}
