import type {
  NextFunction,
  Response,
} from "express";

import { requireParam } from "../../../lib/params.js";

import type {
  AuthenticatedRequest,
} from "../../../middleware/auth.middleware.js";

import * as adminService from "../services/admin.service.js";

export async function getDashboard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const dashboard = await adminService.getPlatformDashboard();
    return res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
}

export async function getOrganizations(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const search = req.query.search as string | undefined;

    const result = await adminService.getAllOrganizations({
      page,
      pageSize,
      search,
    });

    return res.status(200).json(result);
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
    const id = requireParam(req.params.id, "id");
    const organization = await adminService.getOrganizationById(id);
    return res.status(200).json(organization);
  } catch (error) {
    next(error);
  }
}

export async function suspendOrganization(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = requireParam(req.params.id, "id");
    const result = await adminService.suspendOrganization(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function activateOrganization(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = requireParam(req.params.id, "id");
    const result = await adminService.activateOrganization(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getUsers(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const search = req.query.search as string | undefined;
    const organizationId = req.query.organizationId as string | undefined;
    const role = req.query.role as string | undefined;

    const result = await adminService.getAllUsers({
      page,
      pageSize,
      search,
      organizationId,
      role,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function toggleUserActive(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = requireParam(req.params.id, "id");
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be a boolean" });
    }

    const result = await adminService.toggleUserActive(id, isActive);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
