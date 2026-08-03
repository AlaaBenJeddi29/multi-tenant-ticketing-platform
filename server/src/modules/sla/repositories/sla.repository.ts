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

  createdAt: true,

  updatedAt: true,

  priority: true,
} satisfies Prisma.SlaSelect;

export function findSlas(
  organizationId: string
) {}

export function findSlaById(
  id: string,
  organizationId: string
) {}

export function findSlaByPriority(
  priorityId: string,
  organizationId: string
) {}

export function createSla(
  data: Prisma.SlaCreateInput
) {}

export function updateSla(
  id: string,
  data: Prisma.SlaUpdateInput
) {}

export function deleteSla(
  id: string
) {}