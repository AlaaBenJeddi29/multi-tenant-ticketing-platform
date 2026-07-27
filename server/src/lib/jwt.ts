import jwt from "jsonwebtoken";
import type { JwtPayload } from "../middleware/auth.middleware.js";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}