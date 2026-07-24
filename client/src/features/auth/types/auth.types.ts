export interface LoginRequest {
  email: string;
  password: string;
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