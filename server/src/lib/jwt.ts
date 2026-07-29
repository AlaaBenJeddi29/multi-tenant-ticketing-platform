import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  organizationId: string;
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "AGENT";
}

const JWT_SECRET = process.env.JWT_SECRET!;

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}