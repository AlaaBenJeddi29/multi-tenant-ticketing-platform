import type {
  NextFunction,
  Response,
} from "express";

import type {
  AuthenticatedRequest,
} from "../../../middleware/auth.middleware.js";

import * as dashboardService
  from "../services/dashboard.service.js";

export async function getDashboard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const dashboard =
      await dashboardService.getDashboard(
        req.user!.organizationId
      );

    return res
      .status(200)
      .json(dashboard);
  } catch (error) {
    next(error);
  }
}