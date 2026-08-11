import type { CookieOptions } from "express";

export const accessTokenCookie: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60, // 1 hour
};

export const refreshTokenCookie: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  path: "/api/auth", // Only sent to auth endpoints - not leaked to every API request
};
