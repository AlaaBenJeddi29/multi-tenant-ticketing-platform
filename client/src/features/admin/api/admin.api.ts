import { api } from "@/api/client";

const BASE_URL = "/admin";

/**
 * Get platform dashboard statistics
 * Requires SUPER_ADMIN role
 */
export async function getAdminDashboard() {
  const response = await api.get(`${BASE_URL}/dashboard`);
  return response.data;
}

/**
 * Get paginated list of organizations
 * Requires SUPER_ADMIN role
 */
export async function getAdminOrganizations(params: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  const response = await api.get(`${BASE_URL}/organizations`, { params });
  return response.data;
}

/**
 * Get organization by ID
 * Requires SUPER_ADMIN role
 */
export async function getAdminOrganization(id: string) {
  const response = await api.get(`${BASE_URL}/organizations/${id}`);
  return response.data;
}

/**
 * Suspend organization
 * Requires SUPER_ADMIN role
 */
export async function suspendOrganization(id: string) {
  const response = await api.patch(`${BASE_URL}/organizations/${id}/suspend`);
  return response.data;
}

/**
 * Activate organization
 * Requires SUPER_ADMIN role
 */
export async function activateOrganization(id: string) {
  const response = await api.patch(`${BASE_URL}/organizations/${id}/activate`);
  return response.data;
}

/**
 * Get platform-wide users
 * Requires SUPER_ADMIN role
 */
export async function getAdminUsers(params: {
  page: number;
  pageSize: number;
  search?: string;
  organizationId?: string;
  role?: string;
}) {
  const response = await api.get(`${BASE_URL}/users`, { params });
  return response.data;
}

/**
 * Toggle user active status
 * Requires SUPER_ADMIN role
 */
export async function toggleUserActive(userId: string, isActive: boolean) {
  const response = await api.patch(`${BASE_URL}/users/${userId}/toggle-active`, { isActive });
  return response.data;
}
