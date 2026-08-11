import crypto from "crypto";
import { prisma } from "./prisma.js";

const REFRESH_TOKEN_EXPIRY_DAYS = 30;

/**
 * Generate a cryptographically secure random token
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex");
}

/**
 * Hash a refresh token using SHA-256
 */
export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Store a refresh token in the database (stores only the hash)
 * @param userId - The user ID to associate with this token
 * @param token - The raw refresh token (will be hashed before storage)
 * @returns The created RefreshToken record
 */
export async function storeRefreshToken(userId: string, token: string) {
  const tokenHash = hashRefreshToken(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  return prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });
}

/**
 * Find a valid (non-revoked, non-expired) refresh token
 * @param token - The raw refresh token to look up
 * @returns The RefreshToken record if found and valid, null otherwise
 */
export async function findValidRefreshToken(token: string) {
  const tokenHash = hashRefreshToken(token);
  const now = new Date();

  return prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: {
        gt: now,
      },
    },
    include: {
      user: true,
    },
  });
}

/**
 * Revoke a refresh token by setting its revokedAt timestamp
 * @param token - The raw refresh token to revoke
 * @returns The updated RefreshToken record if found, null otherwise
 */
export async function revokeRefreshToken(token: string) {
  const tokenHash = hashRefreshToken(token);

  try {
    return await prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  } catch (error) {
    // Token not found or already revoked
    return null;
  }
}

/**
 * Revoke all refresh tokens for a specific user
 * @param userId - The user ID whose tokens should be revoked
 */
export async function revokeAllUserRefreshTokens(userId: string) {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

/**
 * Clean up expired refresh tokens from the database
 * This can be run periodically as a maintenance task
 */
export async function cleanupExpiredRefreshTokens() {
  const now = new Date();

  return prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });
}
