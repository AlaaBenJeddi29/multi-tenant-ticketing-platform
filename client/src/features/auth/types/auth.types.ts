export type UserRole =
  | "SUPER_ADMIN"
  | "ORG_ADMIN"
  | "AGENT";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  organizationId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
  organizationSlug: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  code: string;
}

export interface ResetPasswordRequest {
  code: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: AuthUser;
}