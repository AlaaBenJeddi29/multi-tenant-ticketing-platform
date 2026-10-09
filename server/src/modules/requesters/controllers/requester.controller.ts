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
  createRequesterSchema,
} from "../dto/create-requester.dto.js";

import {
  updateRequesterSchema,
} from "../dto/update-requester.dto.js";

import {
  listRequestersQuerySchema,
} from "../dto/list-requesters.dto.js";

import * as requesterService
  from "../services/requester.service.js";

export async function getRequesters(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const query =
      listRequestersQuerySchema.parse(req.query);

    const requesters =
      await requesterService.getRequesters(
        requireOrganizationId(req),
        query
      );

    return res.status(200).json(requesters);
  } catch (error) {
    next(error);
  }
}

export async function getRequester(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const requester =
      await requesterService.getRequesterById(
        requireParam(req.params.id, "id"),
        requireOrganizationId(req)
      );

    return res.status(200).json(requester);
  } catch (error) {
    next(error);
  }
}

export async function createRequester(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      createRequesterSchema.parse(req.body);

    const requester =
      await requesterService.createNewRequester(
        body,
        requireOrganizationId(req)
      );

    return res
      .status(201)
      .json(requester);
  } catch (error) {
    next(error);
  }
}

export async function updateRequester(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      updateRequesterSchema.parse(req.body);

    const requester =
      await requesterService.editRequester(
        requireParam(req.params.id, "id"),
        requireOrganizationId(req),
        body
      );

    return res.status(200).json(requester);
  } catch (error) {
    next(error);
  }
}

export async function activateRequester(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const requester =
      await requesterService.activateRequester(
        requireParam(req.params.id, "id"),
        requireOrganizationId(req)
      );

    return res.status(200).json(requester);
  } catch (error) {
    next(error);
  }
}

export async function deactivateRequester(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const requester =
      await requesterService.deactivateRequester(
        requireParam(req.params.id, "id"),
        requireOrganizationId(req)
      );

    return res.status(200).json(requester);
  } catch (error) {
    next(error);
  }
}

export async function deleteRequester(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await requesterService.removeRequester(
      requireParam(req.params.id, "id"),
      requireOrganizationId(req)
    );

    return res.status(200).json({
      message:
        "Requester deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}