import { prisma } from "../../../lib/prisma.js";
import type {
  Prisma,
} from "../../../generated/prisma/client.js";
import { getSkipTake } from "../../../lib/pagination.js";
import type { ListSlasQuery } from "../dto/list-slas.dto.js";

const slaSelect = {
  id: true,

  name: true,

  responseTimeMinutes: true,

  resolutionTimeMinutes: true,

  isActive: true,

  organizationId: true,

  priorityId: true,

  createdAt: true,

  updatedAt: true,

  priority: true,
} satisfies Prisma.SlaSelect;

export async function findSlas(
  organizationId: string,
  query: ListSlasQuery
) {
  const where: Prisma.SlaWhereInput = {
    organizationId,
  };

  // Apply search filter (name)
  if (query.search) {
    where.name = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  // Apply isActive filter
  if (query.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  // Build orderBy
  const orderBy: Prisma.SlaOrderByWithRelationInput = {
    [query.sortBy]: query.sortOrder,
  };

  // Calculate pagination
  const { skip, take } = getSkipTake(query.page, query.pageSize);

  // Execute queries in parallel
  const [items, total] = await Promise.all([
    prisma.sla.findMany({
      where,
      orderBy,
      skip,
      take,
      select: slaSelect,
    }),
    prisma.sla.count({ where }),
  ]);

  return { items, total };
}

export function findSlaById(
  id: string,
  organizationId: string
) {
  return prisma.sla.findFirst({
    where: {
      id,
      organizationId,
    },

    select: slaSelect,
  });
}

export function findSlaByPriority(
  organizationId: string,
  priorityId: string
) {
  return prisma.sla.findFirst({
    where: {
      organizationId,
      priorityId,
    },
  });
}

export function createSla(
  data: Prisma.SlaCreateInput
) {
  return prisma.sla.create({
    data,

    select: slaSelect,
  });
}

export function updateSla(
  id: string,
  data: Prisma.SlaUpdateInput
) {
  return prisma.sla.update({
    where: {
      id,
    },

    data,

    select: slaSelect,
  });
}

export function deleteSla(
  id: string
) {
  return prisma.sla.delete({
    where: {
      id,
    },

    select: {
      id: true,
    },
  });
}
export function findActiveSlaByPriority(
  priorityId: string,
  organizationId: string
) {
  return prisma.sla.findFirst({
    where: {
      priorityId,
      organizationId,
      isActive: true,
    },

    select: {
      responseTimeMinutes: true,

      resolutionTimeMinutes: true,
    },
  });
}
