import { prisma } from "../../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";

export function findCategories(
  organizationId: string
) {
  return prisma.category.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export function findCategoryById(
  id: string,
  organizationId: string
) {
  return prisma.category.findFirst({
    where: {
      id,
      organizationId,
    },
  });
}

export function findCategoryByName(
  name: string,
  organizationId: string
) {
  return prisma.category.findFirst({
    where: {
      name,
      organizationId,
    },
  });
}

export function createCategory(
  data: Prisma.CategoryCreateInput
) {
  return prisma.category.create({
    data,
  });
}

export function updateCategory(
  id: string,
  data: Prisma.CategoryUpdateInput
) {
  return prisma.category.update({
    where: {
      id,
    },
    data,
  });
}

export function deleteCategory(
  id: string
) {
  return prisma.category.delete({
    where: {
      id,
    },
  });
}