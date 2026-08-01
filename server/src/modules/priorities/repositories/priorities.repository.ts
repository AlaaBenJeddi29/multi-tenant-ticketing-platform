import { prisma } from "../../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";

export function findPriorities(
  organizationId: string
) {
  return prisma.priority.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      level: "asc",
    },
  });
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