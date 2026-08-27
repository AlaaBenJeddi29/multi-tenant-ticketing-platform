import { prisma } from "../../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      organization: true,
    },
  });
}

export async function findOrganizationBySlug(slug: string) {
  return prisma.organization.findUnique({
    where: {
      slug,
    },
  });
}

export async function createOrganization(
  data: Prisma.OrganizationCreateInput
) {
  return prisma.organization.create({
    data,
  });
}

export async function createUser(
  data: Prisma.UserCreateInput
) {
  return prisma.user.create({
    data,
  });
}

export async function updatePassword(
  userId: string,
  passwordHash: string
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash,
    },
  });
}

export async function updateResetToken(
  userId: string,
  token: string,
  expiresAt: Date
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      resetPasswordToken: token,
      resetPasswordExpiresAt: expiresAt,
      resetPasswordVerified: false,
    },
  });
}

export async function findUserByResetToken(token: string) {
  return prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
    },
  });
}

export async function verifyResetToken(userId: string) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      resetPasswordVerified: true,
    },
  });
}

export async function clearResetToken(userId: string) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
      resetPasswordVerified: false,
    },
  });
}
export async function findUserByVerifiedResetCode(
  token: string
) {
  return prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordVerified: true,
    },
  });
}

export async function findUserById(
  userId: string,
  organizationId: string | null
) {
  return prisma.user.findFirst({
    where: {
      id: userId,
      ...(organizationId && { organizationId }),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      organizationId: true,
      isActive: true,
    },
  });
}

export async function updateLastLoginAt(userId: string) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });
}

export async function updateUserProfile(
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
  }
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatarUrl: true,
      role: true,
      organizationId: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });
}

export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatarUrl: true,
      role: true,
      organizationId: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });
}

export async function getUserWithPasswordHash(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      passwordHash: true,
    },
  });
}

export async function getUserSessions(userId: string) {
  return prisma.refreshToken.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function revokeSession(tokenId: string, userId: string) {
  return prisma.refreshToken.updateMany({
    where: {
      id: tokenId,
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function revokeAllSessions(userId: string) {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

