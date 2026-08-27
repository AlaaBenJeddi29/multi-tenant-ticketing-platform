export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "AGENT";
  organizationId: string | null;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
}
