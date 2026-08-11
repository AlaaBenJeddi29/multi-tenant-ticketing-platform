import { prisma } from "../../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";
import { getSkipTake } from "../../../lib/pagination.js";
import type { ListRequestersQuery } from "../dto/list-requesters.dto.js";

const requesterSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  company: true,
  notes: true,
  isActive: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RequesterSelect;

export async function findRequesters(
  organizationId: string,
  query: ListRequestersQuery
) {
  const where: Prisma.RequesterWhereInput = {
    organizationId,
  };

  // Apply search filter (firstName, lastName, email, company)
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
      {
        company: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Apply isActive filter
  if (query.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  // Build orderBy
  const orderBy: Prisma.RequesterOrderByWithRelationInput = {
    [query.sortBy]: query.sortOrder,
  };

  // Calculate pagination
  const { skip, take } = getSkipTake(query.page, query.pageSize);

  // Execute queries in parallel
  const [items, total] = await Promise.all([
    prisma.requester.findMany({
      where,
      orderBy,
      skip,
      take,
      select: requesterSelect,
    }),
    prisma.requester.count({ where }),
  ]);

  return { items, total };
}

export function findRequesterById(
  id: string,
  organizationId: string
) {
  return prisma.requester.findFirst({
    where: {
      id,
      organizationId,
    },
    select: requesterSelect,
  });
}

export function findRequesterByEmail(
  email: string,
  organizationId: string
) {
  return prisma.requester.findFirst({
    where: {
      email,
      organizationId,
    },
    select: requesterSelect,
  });
}

export function createRequester(
  data: Prisma.RequesterCreateInput
) {
  return prisma.requester.create({
    data,
    select: requesterSelect,
  });
}

export function updateRequester(
  id: string,
  data: Prisma.RequesterUpdateInput
) {
  return prisma.requester.update({
    where: {
      id,
    },
    data,
    select: requesterSelect,
  });
}

export function deleteRequester(
  id: string
) {
  return prisma.requester.delete({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });
}