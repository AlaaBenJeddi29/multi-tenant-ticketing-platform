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
    if (!req.user?.organizationId) {
      return res.status(400).json({
        message: "Organization ID is required",
      });
    }

    const dashboard =
      await dashboardService.getDashboard(
        req.user.organizationId,
        req.user.role,
        req.user.userId
      );

    return res
      .status(200)
      .json(dashboard);
  } catch (error) {
    next(error);
  }
}