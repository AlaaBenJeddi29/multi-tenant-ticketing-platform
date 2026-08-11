import type {
  NextFunction,
  Response,
} from "express";

import { requireParam } from "../../../lib/params.js";

import type {
  AuthenticatedRequest,
} from "../../../middleware/auth.middleware.js";

import {
  createPrioritySchema,
} from "../dto/create-priority.dto.js";

import {
  updatePrioritySchema,
} from "../dto/update-priority.dto.js";

import {
  listPrioritiesQuerySchema,
} from "../dto/list-priorities.dto.js";

import * as prioritiesService
from "../services/priorities.service.js";

export async function getPriorities(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const query =
      listPrioritiesQuerySchema.parse(req.query);

    const priorities =
      await prioritiesService.getPriorities(
        req.user!.organizationId,
        query
      );

    return res.status(200).json(priorities);
  } catch (error) {
    next(error);
  }
}

export async function getPriority(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const priority =
      await prioritiesService.getPriorityById(
        requireParam(req.params.id, "id"),
        req.user!.organizationId
      );

    return res.status(200).json(priority);
  } catch (error) {
    next(error);
  }
}

export async function createPriority(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      createPrioritySchema.parse(req.body);

    const priority =
      await prioritiesService.createNewPriority(
        body,
        req.user!.organizationId
      );

    return res.status(201).json(priority);
  } catch (error) {
    next(error);
  }
}

export async function updatePriority(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      updatePrioritySchema.parse(req.body);

    const priority =
      await prioritiesService.editPriority(
        requireParam(req.params.id, "id"),
        req.user!.organizationId,
        body
      );

    return res.status(200).json(priority);
  } catch (error) {
    next(error);
  }
}

export async function activatePriority(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const priority =
      await prioritiesService.activatePriority(
        requireParam(req.params.id, "id"),
        req.user!.organizationId
      );

    return res.status(200).json(priority);
  } catch (error) {
    next(error);
  }
}

export async function deactivatePriority(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const priority =
      await prioritiesService.deactivatePriority(
        requireParam(req.params.id, "id"),
        req.user!.organizationId
      );

    return res.status(200).json(priority);
  } catch (error) {
    next(error);
  }
}

export async function deletePriority(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await prioritiesService.removePriority(
      requireParam(req.params.id, "id"),
      req.user!.organizationId
    );

    return res.status(200).json({
      message:
        "Priority deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}