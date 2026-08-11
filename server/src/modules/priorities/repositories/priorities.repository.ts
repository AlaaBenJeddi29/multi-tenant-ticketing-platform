import { prisma } from "../../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";
import { getSkipTake } from "../../../lib/pagination.js";
import type { ListPrioritiesQuery } from "../dto/list-priorities.dto.js";

export async function findPriorities(
  organizationId: string,
  query: ListPrioritiesQuery
) {
  const where: Prisma.PriorityWhereInput = {
    organizationId,
  };

  // Apply search filter
  if (query.search) {
    where.name = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  // Apply level filter
  if (query.level !== undefined) {
    where.level = query.level;
  }

  // Apply isActive filter
  if (query.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  // Build orderBy
  const orderBy: Prisma.PriorityOrderByWithRelationInput = {
    [query.sortBy]: query.sortOrder,
  };

  // Calculate pagination
  const { skip, take } = getSkipTake(query.page, query.pageSize);

  // Execute queries in parallel
  const [items, total] = await Promise.all([
    prisma.priority.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.priority.count({ where }),
  ]);

  return { items, total };
}

export function findPriorityById(
  id: string,
  organizationId: string
) {
  return prisma.priority.findFirst({
    where: {
      id,
      organizationId,
    },
  });
}

export function findPriorityByName(
  name: string,
  organizationId: string
) {
  return prisma.priority.findFirst({
    where: {
      name,
      organizationId,
    },
  });
}

export function createPriority(
  data: Prisma.PriorityCreateInput
) {
  return prisma.priority.create({
    data,
  });
}

export function updatePriority(
  id: string,
  data: Prisma.PriorityUpdateInput
) {
  return prisma.priority.update({
    where: {
      id,
    },
    data,
  });
}

export function deletePriority(
  id: string
) {
  return prisma.priority.delete({
    where: {
      id,
    },
  });
}