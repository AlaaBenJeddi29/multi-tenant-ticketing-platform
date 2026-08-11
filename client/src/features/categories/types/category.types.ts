import type { PaginatedResponse, PaginationParams } from "@/types/pagination.types";

/**
 * Category entity from the backend
 */
export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for creating a new category
 */
export interface CreateCategoryInput {
  name: string;
  description?: string;
}

/**
 * Input for updating an existing category
 */
export interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

/**
 * Query parameters for listing categories
 */
export interface CategoryListParams extends PaginationParams {
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "createdAt" | "updatedAt";
}

/**
 * Paginated response for categories list
 */
export type CategoriesResponse = PaginatedResponse<Category>;
