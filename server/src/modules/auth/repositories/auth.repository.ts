import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../lib/prisma.js";

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
    },
  });
}