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
  createSlaSchema,
} from "../dto/create-sla.dto.js";

import {
  updateSlaSchema,
} from "../dto/update-sla.dto.js";

import {
  listSlasQuerySchema,
} from "../dto/list-slas.dto.js";

import * as slaService
  from "../services/sla.service.js";

export async function getSlas(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const query =
      listSlasQuerySchema.parse(req.query);

    const slas =
      await slaService.getSlas(
        requireOrganizationId(req),
        query
      );

    return res.status(200).json(slas);
  } catch (error) {
    next(error);
  }
}

export async function getSla(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const sla =
      await slaService.getSlaById(
        requireParam(req.params.id, "id"),
        requireOrganizationId(req)
      );

    return res.status(200).json(sla);
  } catch (error) {
    next(error);
  }
}

export async function createSla(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      createSlaSchema.parse(req.body);

    const sla =
      await slaService.createNewSla(
        body,
        requireOrganizationId(req)
      );

    return res.status(201).json(sla);
  } catch (error) {
    next(error);
  }
}

export async function updateSla(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      updateSlaSchema.parse(req.body);

    const sla =
      await slaService.editSla(
        requireParam(req.params.id, "id"),
        requireOrganizationId(req),
        body
      );

    return res.status(200).json(sla);
  } catch (error) {
    next(error);
  }
}

export async function activateSla(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const sla =
      await slaService.activateSla(
        requireParam(req.params.id, "id"),
        requireOrganizationId(req)
      );

    return res.status(200).json(sla);
  } catch (error) {
    next(error);
  }
}

export async function deactivateSla(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const sla =
      await slaService.deactivateSla(
        requireParam(req.params.id, "id"),
        requireOrganizationId(req)
      );

    return res.status(200).json(sla);
  } catch (error) {
    next(error);
  }
}

export async function deleteSla(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await slaService.removeSla(
      requireParam(req.params.id, "id"),
      requireOrganizationId(req)
    );

    return res.status(200).json({
      message:
        "SLA deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}