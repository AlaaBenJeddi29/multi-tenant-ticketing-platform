import type { NextFunction, Request, Response } from "express";

import { loginSchema } from "../dto/login.dto.js";
import { registerSchema } from "../validators/auth.validator.js";
import * as authService from "../services/auth.service.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import { accessTokenCookie, refreshTokenCookie } from "../../../lib/cookies.js";
import { forgotPasswordSchema } from "../dto/forgot-password.dto.js";
import { verifyResetCodeSchema } from "../dto/verify-reset-code.dto.js";
import { resetPasswordSchema } from "../dto/reset-password.dto.js";
import { changePasswordSchema } from "../dto/change-password.dto.js";
import { updateProfileSchema } from "../dto/update-profile.dto.js";
import {
  generateRefreshToken,
  storeRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
} from "../../../lib/refreshToken.js";
import { signAccessToken } from "../../../lib/jwt.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = registerSchema.parse(req.body);

    const result = await authService.registerUser(data);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await authService.login(data);

    // Generate and store refresh token
    const refreshToken = generateRefreshToken();
    await storeRefreshToken(result.user.id, refreshToken);

    return res
      .cookie(
        "accessToken",
        result.token,
        accessTokenCookie
      )
      .cookie(
        "refreshToken",
        refreshToken,
        refreshTokenCookie
      )
      .status(200)
      .json({
        user: result.user,
      });
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refreshToken;

    // Revoke the refresh token if present
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    return res
      .clearCookie(
        "accessToken",
        accessTokenCookie
      )
      .clearCookie(
        "refreshToken",
        refreshTokenCookie
      )
      .status(200)
      .json({
        message: "Logged out successfully",
      });
  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .clearCookie("accessToken", accessTokenCookie)
        .clearCookie("refreshToken", refreshTokenCookie)
        .status(401)
        .json({
          message: "Refresh token not found",
        });
    }

    // Find and validate the refresh token
    const tokenRecord = await findValidRefreshToken(refreshToken);

    if (!tokenRecord) {
      return res
        .clearCookie("accessToken", accessTokenCookie)
        .clearCookie("refreshToken", refreshTokenCookie)
        .status(401)
        .json({
          message: "Invalid or expired refresh token",
        });
    }

    // Revoke the old refresh token (rotation - never reuse)
    await revokeRefreshToken(refreshToken);

    // Generate new tokens
    const newAccessToken = signAccessToken({
      userId: tokenRecord.user.id,
      organizationId: tokenRecord.user.organizationId,
      role: tokenRecord.user.role,
    });

    const newRefreshToken = generateRefreshToken();
    await storeRefreshToken(tokenRecord.user.id, newRefreshToken);

    // Return same shape as /me endpoint
    const user = await authService.getCurrentUser(
      tokenRecord.user.id,
      tokenRecord.user.organizationId
    );

    return res
      .cookie("accessToken", newAccessToken, accessTokenCookie)
      .cookie("refreshToken", newRefreshToken, refreshTokenCookie)
      .status(200)
      .json(user);
  } catch (error) {
    next(error);
  }
}

export async function me(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await authService.getCurrentUser(
      req.user!.userId,
      req.user!.organizationId
    );

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = forgotPasswordSchema.parse(req.body);

    await authService.forgotPassword(body.email);

    return res.status(200).json({
      message:
        "If an account exists, a reset code has been sent.",
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyResetCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = verifyResetCodeSchema.parse(req.body);

    const result = await authService.verifyResetCode(body.code);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = resetPasswordSchema.parse(req.body);

    const result = await authService.resetPassword(
      body.code,
      body.password
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const profile = await authService.getProfile(req.user!.userId);

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    next(error);
  }
}

export async function updateProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = updateProfileSchema.parse(req.body);

    const profile = await authService.updateProfile(
      req.user!.userId,
      data
    );

    return res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body = changePasswordSchema.parse(req.body);

    const result = await authService.changePassword(
      req.user!.userId,
      body.currentPassword,
      body.newPassword
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getSessions(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const sessions = await authService.getSessions(req.user!.userId);

    return res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
}

export async function revokeSession(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { sessionId } = req.params;

    if (typeof sessionId !== "string") {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const result = await authService.revokeSessionById(
      sessionId,
      req.user!.userId
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function revokeAllSessions(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await authService.revokeAllUserSessions(req.user!.userId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
