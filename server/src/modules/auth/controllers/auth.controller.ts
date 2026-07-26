import type { Request, Response } from "express";
import { loginSchema } from "../dto/login.dto.js";
import { registerSchema } from "../validators/auth.validator.js";
import { registerUser } from "../services/auth.service.js";
import * as authService from "../services/auth.service.js";

export async function register(
  req: Request,
  res: Response
) {
  try {
    const data = registerSchema.parse(req.body);

    const result = await registerUser(data);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await authService.login(data);
res
  .cookie("accessToken", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  })
  .status(200)
  .json({
    user: result.user,
  });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
}
export function logout(req: Request, res: Response) {
  res
    .clearCookie("accessToken")
    .status(200)
    .json({
      message: "Logged out successfully",
    });
}