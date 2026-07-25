export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponse {
  resetToken: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
  resetToken: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "AGENT";
  tenantId: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}