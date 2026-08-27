import { api } from "@/api/client";

import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  Session,
} from "../types/settings.types";

export async function getProfile() {
  const response = await api.get<UserProfile>("/auth/profile");
  return response.data;
}

export async function updateProfile(data: UpdateProfileRequest) {
  const response = await api.put<UserProfile>("/auth/profile", data);
  return response.data;
}

export async function changePassword(data: ChangePasswordRequest) {
  const response = await api.post<{ message: string }>("/auth/change-password", data);
  return response.data;
}

export async function getSessions() {
  const response = await api.get<Session[]>("/auth/sessions");
  return response.data;
}

export async function revokeSession(sessionId: string) {
  const response = await api.delete<{ message: string }>(`/auth/sessions/${sessionId}`);
  return response.data;
}

export async function revokeAllSessions() {
  const response = await api.delete<{ message: string }>("/auth/sessions");
  return response.data;
}
