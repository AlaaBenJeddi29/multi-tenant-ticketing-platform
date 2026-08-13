import { api } from "@/api/client";
import type {
  User,
  UsersResponse,
  UserListParams,
  CreateUserInput,
  UpdateUserInput,
} from "../types/user.types";

const BASE_URL = "/users";

/**
 * Get paginated list of users
 * Requires ORG_ADMIN role
 */
export async function getUsers(params: UserListParams): Promise<UsersResponse> {
  const response = await api.get<UsersResponse>(BASE_URL, { params });
  return response.data;
}

/**
 * Get a single user by ID
 * Requires ORG_ADMIN role
 */
export async function getUserById(id: string): Promise<User> {
  const response = await api.get<User>(`${BASE_URL}/${id}`);
  return response.data;
}

/**
 * Create a new user
 * Requires ORG_ADMIN role
 * Note: SUPER_ADMIN cannot be created via this endpoint
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  const response = await api.post<User>(BASE_URL, input);
  return response.data;
}

/**
 * Update an existing user
 * Requires ORG_ADMIN role
 * Note: Password cannot be updated here - users must use forgot password flow
 */
export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<User> {
  const response = await api.patch<User>(`${BASE_URL}/${id}`, input);
  return response.data;
}

/**
 * Activate a user
 * Requires ORG_ADMIN role
 */
export async function activateUser(id: string): Promise<User> {
  const response = await api.patch<User>(`${BASE_URL}/${id}/activate`);
  return response.data;
}

/**
 * Deactivate a user
 * Requires ORG_ADMIN role
 */
export async function deactivateUser(id: string): Promise<User> {
  const response = await api.patch<User>(`${BASE_URL}/${id}/deactivate`);
  return response.data;
}

/**
 * Delete a user
 * Requires ORG_ADMIN role
 */
export async function deleteUser(id: string): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
}

