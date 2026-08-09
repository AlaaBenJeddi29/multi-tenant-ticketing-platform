import type { NextFunction, Request, Response } from "express";

import { loginSchema } from "../dto/login.dto.js";
import { registerSchema } from "../validators/auth.validator.js";
import * as authService from "../services/auth.service.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import { accessTokenCookie } from "../../../lib/cookies.js";
import { forgotPasswordSchema } from "../dto/forgot-password.dto.js";
import { verifyResetCodeSchema } from "../dto/verify-reset-code.dto.js";
import { resetPasswordSchema } from "../dto/reset-password.dto.js";

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

    return res
      .cookie(
        "accessToken",
        result.token,
        accessTokenCookie
      )
      .status(200)
      .json({
        user: result.user,
      });
  } catch (error) {
    next(error);
  }
}

export function logout(
  req: Request,
  res: Response
) {
  return res
    .clearCookie(
      "accessToken",
      accessTokenCookie
    )
    .status(200)
    .json({
      message: "Logged out successfully",
    });
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