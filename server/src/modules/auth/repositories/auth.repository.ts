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
  organizationId: string
) {
  return prisma.user.findFirst({
    where: {
      id: userId,
      organizationId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      organizationId: true,
    },
  });
}