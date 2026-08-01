import { prisma } from "../../../lib/prisma.js";

import type { Prisma } from "../../../generated/prisma/client.js";

export function findUsersByOrganization(
  organizationId: string
) {
  return prisma.user.findMany({
    where: {
      organizationId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export function findUserById(
  id: string,
  organizationId: string
) {
  return prisma.user.findFirst({
    where: {
      id,
      organizationId,
    },
  });
}

export function createUser(
  data: Prisma.UserCreateInput
) {
  return prisma.user.create({
    data,
  });
}

export function updateUser(
  id: string,
  data: Prisma.UserUpdateInput
) {
  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({
    where: {
      id,
    },
  });
}
export function findUserByEmail(
  email: string
) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}