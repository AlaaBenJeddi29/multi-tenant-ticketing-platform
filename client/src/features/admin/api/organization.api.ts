import { api } from "@/api/client";
import type {
  Organization,
  OrganizationsResponse,
  UpdateOrganizationInput,
} from "../types/organization.types";

const BASE_URL = "/organizations";

/**
 * Get all organizations
 * Requires SUPER_ADMIN role
 */
export async function getOrganizations(): Promise<OrganizationsResponse> {
  const response = await api.get<OrganizationsResponse>(BASE_URL);
  return response.data;
}

/**
 * Get organization by ID
 * Requires SUPER_ADMIN role
 */
export async function getOrganizationById(id: string): Promise<Organization> {
  const response = await api.get<Organization>(`${BASE_URL}/${id}`);
  return response.data;
}

/**
 * Update organization
 * Requires SUPER_ADMIN role
 */
export async function updateOrganization(
  id: string,
  input: UpdateOrganizationInput
): Promise<Organization> {
  const response = await api.put<Organization>(`${BASE_URL}/${id}`, input);
  return response.data;
}
