import { api } from "@/api/client";
import type {
  Sla,
  SlasResponse,
  SlaListParams,
  CreateSlaInput,
  UpdateSlaInput,
} from "../types/sla.types";

const BASE_URL = "/slas";

/**
 * Get paginated list of SLAs
 */
export async function getSlas(params: SlaListParams): Promise<SlasResponse> {
  const response = await api.get<SlasResponse>(BASE_URL, { params });
  return response.data;
}

/**
 * Get a single SLA by ID
 */
export async function getSlaById(id: string): Promise<Sla> {
  const response = await api.get<Sla>(`${BASE_URL}/${id}`);
  return response.data;
}

/**
 * Create a new SLA
 * Requires ORG_ADMIN role
 */
export async function createSla(input: CreateSlaInput): Promise<Sla> {
  const response = await api.post<Sla>(BASE_URL, input);
  return response.data;
}

/**
 * Update an existing SLA
 * Requires ORG_ADMIN role
 */
export async function updateSla(id: string, input: UpdateSlaInput): Promise<Sla> {
  const response = await api.patch<Sla>(`${BASE_URL}/${id}`, input);
  return response.data;
}

/**
 * Activate an SLA
 * Requires ORG_ADMIN role
 */
export async function activateSla(id: string): Promise<Sla> {
  const response = await api.patch<Sla>(`${BASE_URL}/${id}/activate`);
  return response.data;
}

/**
 * Deactivate an SLA
 * Requires ORG_ADMIN role
 */
export async function deactivateSla(id: string): Promise<Sla> {
  const response = await api.patch<Sla>(`${BASE_URL}/${id}/deactivate`);
  return response.data;
}

/**
 * Delete an SLA
 * Requires ORG_ADMIN role
 */
export async function deleteSla(id: string): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
}
