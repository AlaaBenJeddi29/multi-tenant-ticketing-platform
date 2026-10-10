import jwt, { TokenExpiredError } from "jsonwebtoken";
import { describe, expect, it } from "vitest";

import { signAccessToken, verifyAccessToken } from "../../src/lib/jwt.js";
import type { JwtPayload } from "../../src/lib/jwt.js";

const payload: JwtPayload = {
  userId: "user_1",
  organizationId: "org_1",
  role: "ORG_ADMIN",
};

describe("jwt utilities", () => {
  it("verifies a token created by signAccessToken", () => {
    const token = signAccessToken(payload);
    const decoded = verifyAccessToken(token);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.organizationId).toBe(payload.organizationId);
    expect(decoded.role).toBe(payload.role);
  });

  it("rejects an expired token", () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not set for the unit test environment");
    }

    // Deterministic expiry: the claim is 60 seconds in the past, so no sleeping
    // is required to observe rejection.
    const expiredToken = jwt.sign(
      {
        userId: payload.userId,
        organizationId: payload.organizationId,
        role: payload.role,
        exp: Math.floor(Date.now() / 1000) - 60,
      },
      secret
    );

    expect(() => verifyAccessToken(expiredToken)).toThrow(TokenExpiredError);
  });
});
