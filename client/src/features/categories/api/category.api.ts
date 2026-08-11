import { api } from "@/api/client";
import type {
  Category,
  CategoriesResponse,
  CategoryListParams,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/category.types";

const BASE_URL = "/categories";

/**
 * Get paginated list of categories
 */
export async function getCategories(
  params: CategoryListParams
): Promise<CategoriesResponse> {
  const response = await api.get<CategoriesResponse>(BASE_URL, { params });
  return response.data;
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: string): Promise<Category> {
  const response = await api.get<Category>(`${BASE_URL}/${id}`);
  return response.data;
}

/**
 * Create a new category
 * Requires ORG_ADMIN role
 */
export async function createCategory(
  input: CreateCategoryInput
): Promise<Category> {
  const response = await api.post<Category>(BASE_URL, input);
  return response.data;
}

/**
 * Update an existing category
 * Requires ORG_ADMIN role
 */
export async function updateCategory(
  id: string,
  input: UpdateCategoryInput
): Promise<Category> {
  const response = await api.put<Category>(`${BASE_URL}/${id}`, input);
  return response.data;
}

/**
 * Activate a category
 * Requires ORG_ADMIN role
 */
export async function activateCategory(id: string): Promise<Category> {
  const response = await api.patch<Category>(`${BASE_URL}/${id}/activate`);
  return response.data;
}

/**
 * Deactivate a category
 * Requires ORG_ADMIN role
 */
export async function deactivateCategory(id: string): Promise<Category> {
  const response = await api.patch<Category>(`${BASE_URL}/${id}/deactivate`);
  return response.data;
}

/**
 * Delete a category
 * Requires ORG_ADMIN role
 */
export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
}
