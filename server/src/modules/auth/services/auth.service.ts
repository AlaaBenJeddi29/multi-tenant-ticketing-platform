import bcrypt from "bcrypt";
import type { RegisterDto } from "../dto/register.dto.js";
import { signAccessToken } from "../../../lib/jwt.js";
import { AppError } from "../../../lib/AppError.js"; 
import { emailService } from "../../../lib/email/index.js";
import {
  findUserByEmail,
  findOrganizationBySlug,
  createOrganization,
  createUser,
  updateResetToken,
  findUserByResetToken,
  verifyResetToken,
  clearResetToken,
  findUserByVerifiedResetCode,
  updatePassword,
  findUserById,
  updateLastLoginAt,
  getUserProfile,
  updateUserProfile,
  getUserWithPasswordHash,
  getUserSessions,
  revokeSession,
  revokeAllSessions,
} from "../repositories/auth.repository.js";
import { LoginDto } from "../dto/login.dto.js";

export async function registerUser(dto: RegisterDto) {
  const existingUser = await findUserByEmail(dto.email);

  if (existingUser) {
    throw new AppError(409, "An account with this email address already exists.");
  }

  const existingOrganization = await findOrganizationBySlug(
    dto.organizationSlug
  );

  if (existingOrganization) {
    throw new AppError(409, "An organization with this slug already exists.");
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const organization = await createOrganization({
    name: dto.organizationName,
    slug: dto.organizationSlug,
  });

  await createUser({
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    passwordHash,
    role: "ORG_ADMIN",

    organization: {
      connect: {
        id: organization.id,
      },
    },
  });

  return {
    message: "User registered successfully.",
  };
}

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function login(data: LoginDto) {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new AppError(401, "Invalid email address or password.");
  }

  if (!user.isActive) {
    throw new AppError(403, "Your account has been deactivated. Please contact your administrator.");
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new AppError(401, "Invalid email address or password.");
  }

  const token = signAccessToken({
    userId: user.id,
    organizationId: user.organizationId,
    role: user.role,
  });

  // Update last login time
  await updateLastLoginAt(user.id);

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    },
  };
}

export async function forgotPassword(email: string) {
  const user = await findUserByEmail(email);

  // Return silently to prevent user enumeration security risks
  if (!user) {
    return;
  }

  const code = generateResetCode();

  const expires = new Date(
    Date.now() + 15 * 60 * 1000
  );

  await updateResetToken(
    user.id,
    code,
    expires
  );

  // Send password reset email
  const subject = "Password Reset Code";
  const body = `Hello ${user.firstName},

You requested a password reset for your account.

Your password reset code is: ${code}

This code will expire in 15 minutes.

If you did not request a password reset, please ignore this email.

Best regards,
The Support Team`;

  try {
    await emailService.send(user.email, subject, body);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    // Don't throw - we don't want to reveal whether the email exists
    // The code is still saved in the database and can be used
  }
}

export async function verifyResetCode(code: string) {
  const user = await findUserByResetToken(code);

  if (!user) {
    throw new AppError(400, "Invalid reset code.");
  }

  if (
    !user.resetPasswordExpiresAt ||
    user.resetPasswordExpiresAt < new Date()
  ) {
    throw new AppError(400, "Reset code has expired. Please request a new one.");
  }

  await verifyResetToken(user.id);

  return {
    message: "Reset code verified successfully.",
  };
}

export async function resetPassword(
  code: string,
  password: string
) {
  const user = await findUserByVerifiedResetCode(code);

  if (!user) {
    throw new AppError(400, "Invalid or unverified reset code.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await updatePassword(
    user.id,
    passwordHash
  );

  await clearResetToken(user.id);

  return {
    message: "Password updated successfully.",
  };
}

export async function getCurrentUser(
  userId: string,
  organizationId: string | null
) {
  const user = await findUserById(userId, organizationId);

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  if (!user.isActive) {
    throw new AppError(403, "Your account has been deactivated. Please contact your administrator.");
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
  };
}

export async function getProfile(userId: string) {
  const user = await getUserProfile(userId);

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    role: user.role,
    organizationId: user.organizationId,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
  };
}

export async function updateProfile(
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
  }
) {
  const user = await updateUserProfile(userId, data);

  return user;
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await getUserWithPasswordHash(userId);

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new AppError(401, "Current password is incorrect.");
  }

  if (currentPassword === newPassword) {
    throw new AppError(400, "New password must be different from current password.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await updatePassword(userId, passwordHash);

  return {
    message: "Password changed successfully.",
  };
}

export async function getSessions(userId: string) {
  const sessions = await getUserSessions(userId);

  return sessions;
}

export async function revokeSessionById(sessionId: string, userId: string) {
  await revokeSession(sessionId, userId);

  return {
    message: "Session revoked successfully.",
  };
}

export async function revokeAllUserSessions(userId: string) {
  await revokeAllSessions(userId);

  return {
    message: "All sessions revoked successfully.",
  };
}
