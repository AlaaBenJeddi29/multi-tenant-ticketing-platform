import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
import { findUserById } from "../modules/auth/repositories/auth.repository.js";

export interface JwtPayload {
  userId: string;
  organizationId: string | null;
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "AGENT";
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const payload = verifyAccessToken(token) as JwtPayload;

    // Check if user is still active
    const user = await findUserById(payload.userId, payload.organizationId);
    
    if (!user || !user.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated. Please contact your administrator.",
      });
    }

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}