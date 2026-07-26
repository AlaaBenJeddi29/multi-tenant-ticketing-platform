import { api } from "@/api/client";

import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
  AuthResponse,
} from "../types/auth.types";

export const login = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (
  data: RegisterRequest
) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const forgotPassword = async (
  data: ForgotPasswordRequest
) => {
  const response = await api.post(
    "/auth/forgot-password",
    data
  );

  return response.data;
};

export const verifyResetCode = async (
  data: VerifyResetCodeRequest
) => {
  const response = await api.post(
    "/auth/verify-reset-code",
    data
  );

  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordRequest
) => {
  const response = await api.post(
    "/auth/reset-password",
    data
  );

  return response.data;
};