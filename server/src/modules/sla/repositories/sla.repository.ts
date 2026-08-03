import { prisma } from "../../../lib/prisma.js";
import type {
  Prisma,
} from "../../../generated/prisma/client.js";

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

export function findSlas(
  organizationId: string
) {
  return prisma.sla.findMany({
    where: {
      organizationId,
    },

    orderBy: {
      createdAt: "desc",
    },

    select: slaSelect,
  });
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
  priorityId: string,
  organizationId: string
) {
  return prisma.sla.findFirst({
    where: {
      priorityId,
      organizationId,
    },

    select: slaSelect,
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