import { api } from "@/api/client";

import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
  AuthResponse,
} from "../types/auth.types";

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post("/auth/forgot-password", data),

  verifyResetCode: (data: VerifyResetCodeRequest) =>
    api.post<{ resetToken: string }>("/auth/verify-reset-code", data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post("/auth/reset-password", data),

  logout: () =>
    api.post("/auth/logout"),
};