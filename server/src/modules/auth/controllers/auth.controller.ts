import type { Request, Response } from "express";

import { registerSchema } from "../validators/auth.validator.js";
import { registerUser } from "../services/auth.service.js";

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