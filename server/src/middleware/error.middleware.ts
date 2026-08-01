import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { ZodError } from "zod";

import { AppError } from "../lib/AppError.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.flatten(),
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
  });
}