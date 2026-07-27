import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.js";

type Role = "SUPER_ADMIN" | "ORG_ADMIN" | "AGENT";

export function authorize(...roles: Role[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
}