import { prisma } from "../../../lib/prisma.js";

import type {
  Prisma,
} from "../../../generated/prisma/client.js";

export function findAllOrganizations() {
  return prisma.organization.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function findOrganizationById(
  id: string
) {
  return prisma.organization.findUnique({
    where: {
      id,
    },
  });
}

export function findOrganizationBySlug(
  slug: string
) {
  return prisma.organization.findUnique({
    where: {
      slug,
    },
  });
}

export function updateOrganization(
  id: string,
  data: Prisma.OrganizationUpdateInput
) {
  return prisma.organization.update({
    where: {
      id,
    },
    data,
  });
}