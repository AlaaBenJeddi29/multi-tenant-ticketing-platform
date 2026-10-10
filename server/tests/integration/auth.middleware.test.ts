import request from "supertest";
import jwt from "jsonwebtoken";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import app from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";
import { signAccessToken } from "../../src/lib/jwt.js";
import {
  cleanupOrganizations,
  createOrgFixtures,
  uniqueSuffix,
  type OrgFixtures,
} from "./helpers/fixtures.js";

/**
 * Exercises the real authenticate middleware through the Express app on a
 * protected route. A ticket route is used because it is behind authenticate +
 * authorize and returns a decodable body once authentication succeeds.
 */
const PROTECTED_ROUTE = "/api/tickets";

let fx: OrgFixtures;

beforeAll(async () => {
  fx = await createOrgFixtures(uniqueSuffix());
});

afterAll(async () => {
  await cleanupOrganizations([fx.orgId]);
  await prisma.$disconnect();
});

function cookieValue(token: string) {
  return `accessToken=${token}`;
}

describe("authenticate middleware (integration)", () => {
  it("returns 401 when the access token cookie is missing", async () => {
    const res = await request(app).get(PROTECTED_ROUTE);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Authentication required" });
  });

  it("returns 401 for a malformed token", async () => {
    const res = await request(app)
      .get(PROTECTED_ROUTE)
      .set("Cookie", cookieValue("definitely-not-a-jwt"));

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Invalid token" });
  });

  it("returns 401 for an expired token", async () => {
    // Deterministic expiry: the claim is already in the past, so no sleeping is
    // required for jsonwebtoken to reject it.
    const expiredToken = jwt.sign(
      { userId: fx.adminId, organizationId: fx.orgId, role: "ORG_ADMIN" },
      process.env.JWT_SECRET!,
      { expiresIn: "-10s" }
    );

    const res = await request(app)
      .get(PROTECTED_ROUTE)
      .set("Cookie", cookieValue(expiredToken));

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Invalid token" });
  });

  it("returns 403 for a validly signed token of a nonexistent user", async () => {
    const token = signAccessToken({
      userId: "cknonexistentuser0000000000",
      organizationId: null,
      role: "ORG_ADMIN",
    });

    const res = await request(app)
      .get(PROTECTED_ROUTE)
      .set("Cookie", cookieValue(token));

    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      message:
        "Your account has been deactivated. Please contact your administrator.",
    });
  });

  it("returns 403 for a validly signed token of a deactivated user", async () => {
    const token = signAccessToken({
      userId: fx.inactiveAgentId,
      organizationId: fx.orgId,
      role: "AGENT",
    });

    const res = await request(app)
      .get(PROTECTED_ROUTE)
      .set("Cookie", cookieValue(token));

    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      message:
        "Your account has been deactivated. Please contact your administrator.",
    });
  });

  it("lets an active, same-tenant user pass authentication", async () => {
    const token = signAccessToken({
      userId: fx.adminId,
      organizationId: fx.orgId,
      role: "ORG_ADMIN",
    });

    const res = await request(app)
      .get(PROTECTED_ROUTE)
      .set("Cookie", cookieValue(token));

    expect(res.status).toBe(200);
  });
});
