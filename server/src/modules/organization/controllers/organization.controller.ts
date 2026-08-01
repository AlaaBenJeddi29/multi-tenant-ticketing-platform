import type {
  Response,
  NextFunction,
} from "express";

import type {
  AuthenticatedRequest,
} from "../../../middleware/auth.middleware.js";

import { requireParam } from "../../../lib/params.js";

import {
  updateOrganizationSchema,
} from "../dto/update-organization.dto.js";

import * as organizationService
from "../services/organization.service.js";

export async function getOrganizations(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const organizations =
      await organizationService.getOrganizations();

    return res.status(200).json(
      organizations
    );
  } catch (error) {
    next(error);
  }
}

export async function getOrganization(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = requireParam(
      req.params.id,
      "id"
    );

    const organization =
      await organizationService.getOrganization(
        id
      );

    return res.status(200).json(
      organization
    );
  } catch (error) {
    next(error);
  }
}

export async function getMyOrganization(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const organization =
      await organizationService.getMyOrganization(
        req.user!.organizationId
      );

    return res.status(200).json(
      organization
    );
  } catch (error) {
    next(error);
  }
}

export async function updateOrganization(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = requireParam(
      req.params.id,
      "id"
    );

    const body =
      updateOrganizationSchema.parse(
        req.body
      );

    const organization =
      await organizationService.updateOrganizationById(
        id,
        body
      );

    return res.status(200).json(
      organization
    );
  } catch (error) {
    next(error);
  }
}

export async function updateMyOrganization(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      updateOrganizationSchema.parse(
        req.body
      );

    const organization =
      await organizationService.updateMyOrganization(
        req.user!.organizationId,
        body
      );

    return res.status(200).json(
      organization
    );
  } catch (error) {
    next(error);
  }
}