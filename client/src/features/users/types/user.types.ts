import type { PaginatedResponse } from "@/types/pagination.types";

/**
 * User role enum
 */
export type UserRole = "SUPER_ADMIN" | "ORG_ADMIN" | "AGENT";

/**
 * User entity from the API
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for creating a new user
 * Note: SUPER_ADMIN cannot be created via this endpoint
 */
export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "ORG_ADMIN" | "AGENT";
}

/**
 * Input for updating an existing user
 * Note: Password cannot be updated here - use forgot password flow
 */
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  role?: "ORG_ADMIN" | "AGENT";
}

/**
 * Query parameters for listing users
 */
export interface UserListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * Paginated response for users list
 */
export type UsersResponse = PaginatedResponse<User>;
