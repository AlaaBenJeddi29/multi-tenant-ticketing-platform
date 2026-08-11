import { AppError } from "../../../lib/AppError.js";

import type {
  CreateCategoryDto,
} from "../dto/create-category.dto.js";

import type {
  UpdateCategoryDto,
} from "../dto/update-category.dto.js";

import type {
  ListCategoriesQuery,
} from "../dto/list-categories.dto.js";

import {
  createCategory,
  deleteCategory,
  findCategories,
  findCategoryById,
  findCategoryByName,
  updateCategory,
} from "../repositories/categories.repository.js";

import {
  toCategoryResponse,
  toCategoriesListResponse,
} from "../mappers/category.mapper.js";

export async function getCategories(
  organizationId: string,
  query: ListCategoriesQuery
) {
  const { items, total } =
    await findCategories(organizationId, query);

  return toCategoriesListResponse({
    items,
    total,
    page: query.page,
    pageSize: query.pageSize,
  });
}

export async function getCategoryById(
  categoryId: string,
  organizationId: string
) {
  const category =
    await findCategoryById(
      categoryId,
      organizationId
    );

  if (!category) {
    throw new AppError(
      404,
      "Category not found."
    );
  }

  return toCategoryResponse(category);
}

export async function createNewCategory(
  dto: CreateCategoryDto,
  organizationId: string
) {
  const existing =
    await findCategoryByName(
      dto.name,
      organizationId
    );

  if (existing) {
    throw new AppError(
      409,
      "A category with this name already exists."
    );
  }

  const category =
    await createCategory({
      name: dto.name,
      description: dto.description,

      organization: {
        connect: {
          id: organizationId,
        },
      },
    });

  return toCategoryResponse(category);
}

export async function editCategory(
  categoryId: string,
  organizationId: string,
  dto: UpdateCategoryDto
) {
  await getCategoryById(
    categoryId,
    organizationId
  );

  if (dto.name) {
    const existing =
      await findCategoryByName(
        dto.name,
        organizationId
      );

    if (
      existing &&
      existing.id !== categoryId
    ) {
      throw new AppError(
        409,
        "Category name already exists."
      );
    }
  }

  const category =
    await updateCategory(
      categoryId,
      dto
    );

  return toCategoryResponse(category);
}

export async function activateCategory(
  categoryId: string,
  organizationId: string
) {
  await getCategoryById(
    categoryId,
    organizationId
  );

  const category =
    await updateCategory(
      categoryId,
      {
        isActive: true,
      }
    );

  return toCategoryResponse(category);
}

export async function deactivateCategory(
  categoryId: string,
  organizationId: string
) {
  await getCategoryById(
    categoryId,
    organizationId
  );

  const category =
    await updateCategory(
      categoryId,
      {
        isActive: false,
      }
    );

  return toCategoryResponse(category);
}

export async function removeCategory(
  categoryId: string,
  organizationId: string
) {
  await getCategoryById(
    categoryId,
    organizationId
  );

  await deleteCategory(categoryId);
}