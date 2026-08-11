import { prisma } from "../../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";
import { getSkipTake } from "../../../lib/pagination.js";
import type { ListCategoriesQuery } from "../dto/list-categories.dto.js";

export async function findCategories(
  organizationId: string,
  query: ListCategoriesQuery
) {
  const where: Prisma.CategoryWhereInput = {
    organizationId,
  };

  // Apply search filter
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
  const orderBy: Prisma.CategoryOrderByWithRelationInput = {
    [query.sortBy]: query.sortOrder,
  };

  // Calculate pagination
  const { skip, take } = getSkipTake(query.page, query.pageSize);

  // Execute queries in parallel
  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.category.count({ where }),
  ]);

  return { items, total };
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