import { api } from "@/api/client";
import type { PriorityListParams, PrioritiesResponse, Priority } from "../types/priority.types";

export async function getPriorities(params: PriorityListParams): Promise<PrioritiesResponse> {
  const { data } = await api.get<PrioritiesResponse>("/priorities", { params });
  return data;
}

export async function getPriority(id: string): Promise<Priority> {
  const { data } = await api.get<Priority>(`/priorities/${id}`);
  return data;
}

export async function createPriority(data: { name: string; level: string; color: string }): Promise<Priority> {
  const { data: response } = await api.post<Priority>("/priorities", data);
  return response;
}

export async function updatePriority(id: string, data: { name?: string; level?: string; color?: string; isActive?: boolean }): Promise<Priority> {
  const { data: response } = await api.put<Priority>(`/priorities/${id}`, data);
  return response;
}

export async function activatePriority(id: string): Promise<Priority> {
  const { data } = await api.patch<Priority>(`/priorities/${id}/activate`);
  return data;
}

export async function deactivatePriority(id: string): Promise<Priority> {
  const { data } = await api.patch<Priority>(`/priorities/${id}/deactivate`);
  return data;
}

export async function deletePriority(id: string): Promise<void> {
  await api.delete(`/priorities/${id}`);
}
