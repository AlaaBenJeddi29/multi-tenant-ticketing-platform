import { prisma } from "../../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";

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

export function findRequesters(
  organizationId: string
) {
  return prisma.requester.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: requesterSelect,
  });
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