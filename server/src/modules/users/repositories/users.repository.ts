import { prisma } from "../../../lib/prisma.js";

import type { Prisma } from "../../../generated/prisma/client.js";

import { getSkipTake } from "../../../lib/pagination.js";
import type { ListUsersQuery } from "../dto/list-users.dto.js";

export async function findUsersByOrganization(
  organizationId: string,
  query: ListUsersQuery
) {
  const where: Prisma.UserWhereInput = {
    organizationId,
  };

  // Apply search filter (firstName, lastName, email)
  if (query.search) {
    where.OR = [
      {
        firstName: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Apply role filter
  if (query.role !== undefined) {
    where.role = query.role;
  }

  // Apply isActive filter
  if (query.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  // Build orderBy
  const orderBy: Prisma.UserOrderByWithRelationInput = {
    [query.sortBy]: query.sortOrder,
  };

  // Calculate pagination
  const { skip, take } = getSkipTake(query.page, query.pageSize);

  // Execute queries in parallel
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
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