import type { CookieOptions } from "express";

export const accessTokenCookie: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60, // 1 hour
};