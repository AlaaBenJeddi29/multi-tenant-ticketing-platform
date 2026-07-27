import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    role: "SUPER_ADMIN" | "ORG_ADMIN" | "AGENT";
  };
}

type JwtPayload = {
  sub: string;
  tenantId: string;
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "AGENT";
};

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.user = {
      id: decoded.sub,
      tenantId: decoded.tenantId,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}