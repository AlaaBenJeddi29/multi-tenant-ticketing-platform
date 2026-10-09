import type {
  NextFunction,
  Response,
} from "express";

import { requireParam } from "../../../lib/params.js";
import { requireOrganizationId } from "../../../lib/request.js";

import type {
  AuthenticatedRequest,
} from "../../../middleware/auth.middleware.js";

import {
  createCategorySchema,
} from "../dto/create-category.dto.js";

import {
  updateCategorySchema,
} from "../dto/update-category.dto.js";

import {
  listCategoriesQuerySchema,
} from "../dto/list-categories.dto.js";

import * as categoriesService
from "../services/categories.service.js";

export async function getCategories(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const query =
      listCategoriesQuerySchema.parse(req.query);

    const categories =
      await categoriesService.getCategories(
        requireOrganizationId(req),
        query
      );

    return res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function getCategory(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const category =
      await categoriesService.getCategoryById(
        requireParam(req.params.id, "id"),
        requireOrganizationId(req)
      );

    return res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function createCategory(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      createCategorySchema.parse(req.body);

    const category =
      await categoriesService.createNewCategory(
        body,
        requireOrganizationId(req)
      );

    return res
      .status(201)
      .json(category);
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      updateCategorySchema.parse(req.body);

    const category =
      await categoriesService.editCategory(
        requireParam(req.params.id, "id"),
        requireOrganizationId(req),
        body
      );

    return res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function activateCategory(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const category =
      await categoriesService.activateCategory(
        requireParam(req.params.id, "id"),
        requireOrganizationId(req)
      );

    return res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function deactivateCategory(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const category =
      await categoriesService.deactivateCategory(
        requireParam(req.params.id, "id"),
        requireOrganizationId(req)
      );

    return res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await categoriesService.removeCategory(
      requireParam(req.params.id, "id"),
      requireOrganizationId(req)
    );

    return res.json({
      message:
        "Category deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}