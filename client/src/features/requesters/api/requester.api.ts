import { api } from "@/api/client";
import type { RequesterListParams, RequestersResponse, Requester } from "../types/requester.types";

export async function getRequesters(params: RequesterListParams): Promise<RequestersResponse> {
  const { data } = await api.get<RequestersResponse>("/requesters", { params });
  return data;
}

export async function getRequester(id: string): Promise<Requester> {
  const { data } = await api.get<Requester>(`/requesters/${id}`);
  return data;
}

export async function createRequester(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}): Promise<Requester> {
  const { data: response } = await api.post<Requester>("/requesters", data);
  return response;
}

export async function updateRequester(id: string, data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}): Promise<Requester> {
  const { data: response } = await api.patch<Requester>(`/requesters/${id}`, data);
  return response;
}

export async function activateRequester(id: string): Promise<Requester> {
  const { data } = await api.patch<Requester>(`/requesters/${id}/activate`);
  return data;
}

export async function deactivateRequester(id: string): Promise<Requester> {
  const { data } = await api.patch<Requester>(`/requesters/${id}/deactivate`);
  return data;
}

export async function deleteRequester(id: string): Promise<void> {
  await api.delete(`/requesters/${id}`);
}
