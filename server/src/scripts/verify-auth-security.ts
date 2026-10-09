import "dotenv/config";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/AppError.js";

import {
  generateRefreshToken,
  storeRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
  hashRefreshToken,
} from "../lib/refreshToken.js";

import { signAccessToken } from "../lib/jwt.js";

import {
  authenticate,
  type AuthenticatedRequest,
  type JwtPayload,
} from "../middleware/auth.middleware.js";

import { authorize } from "../middleware/authorize.middleware.js";

import { requireOrganizationId } from "../lib/request.js";

import { refresh } from "../modules/auth/controllers/auth.controller.js";

/**
 * Verification for authentication and role-based authorization.
 *
 * Run with: npx tsx src/scripts/verify-auth-security.ts
 *
 * Covers:
 *  - authenticate: missing/invalid/expired access token -> 401; valid token ->
 *    next(); token whose org no longer matches, or deactivated user -> 403.
 *  - refresh rotation: the old token is consumed atomically, so only the first
 *    of two concurrent refreshes wins; expired/revoked tokens are rejected.
 *  - refresh() handler: exercised end-to-end with a request/response harness —
 *    missing/invalid token and losing race -> 401 + cleared cookies + no token
 *    issued/stored; a valid token rotates exactly once.
 *  - authorize: SUPER_ADMIN is confined to administrative routes and cannot
 *    pass a tenant role guard; ordinary roles cannot pass the admin guard.
 *  - requireOrganizationId: a null organization (SUPER_ADMIN session) is
 *    rejected with 403 before any tenant data is touched.
 *
 * Creates isolated fixtures tagged with a run id and removes only those records
 * in a finally block, so it is safe against the local development database.
 */

const RUN_ID = Date.now().toString(36);

interface FakeResponse {
  statusCode: number;
  body: unknown;
  status(code: number): FakeResponse;
  json(payload: unknown): FakeResponse;
}

function makeRes(): FakeResponse {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.body = payload;
      return res;
    },
  };
  return res;
}

function makeNext() {
  let called = false;
  return {
    next: () => {
      called = true;
    },
    wasCalled: () => called,
  };
}

function makeReq(cookies: Record<string, string> = {}, user?: JwtPayload) {
  return { cookies, user };
}

async function runAuthenticate(
  req: ReturnType<typeof makeReq>
): Promise<{ statusCode: number; nextCalled: boolean; user?: JwtPayload }> {
  const res = makeRes();
  const { next, wasCalled } = makeNext();

  await authenticate(
    req as unknown as AuthenticatedRequest,
    res as never,
    next as never
  );

  return { statusCode: res.statusCode, nextCalled: wasCalled(), user: req.user };
}

function runAuthorize(
  roles: Array<"SUPER_ADMIN" | "ORG_ADMIN" | "AGENT">,
  req: ReturnType<typeof makeReq>
): { statusCode: number; nextCalled: boolean } {
  const res = makeRes();
  const { next, wasCalled } = makeNext();

  authorize(...roles)(
    req as unknown as AuthenticatedRequest,
    res as never,
    next as never
  );

  return { statusCode: res.statusCode, nextCalled: wasCalled() };
}

/**
 * Minimal Response stand-in for the real refresh() handler. Records status,
 * body, cookies set (by name) and cookies cleared (by name) so the controller's
 * cookie side effects can be asserted.
 */
interface RefreshResponse {
  statusCode: number;
  body: unknown;
  cookiesSet: string[];
  cookiesCleared: string[];
  status(code: number): RefreshResponse;
  json(payload: unknown): RefreshResponse;
  cookie(name: string, value: string, options?: unknown): RefreshResponse;
  clearCookie(name: string, options?: unknown): RefreshResponse;
}

function makeRefreshRes(): RefreshResponse {
  const res: RefreshResponse = {
    statusCode: 0,
    body: undefined,
    cookiesSet: [],
    cookiesCleared: [],
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(payload) {
      res.body = payload;
      return res;
    },
    cookie(name) {
      res.cookiesSet.push(name);
      return res;
    },
    clearCookie(name) {
      res.cookiesCleared.push(name);
      return res;
    },
  };
  return res;
}

async function callRefresh(
  res: RefreshResponse,
  cookies: Record<string, string>
): Promise<unknown[]> {
  const errors: unknown[] = [];

  await refresh(
    { cookies } as unknown as Request,
    res as unknown as Response,
    ((error?: unknown) => {
      if (error) errors.push(error);
    }) as unknown as NextFunction
  );

  return errors;
}

async function main() {
  const createdOrgIds: string[] = [];

  try {
    const org = await prisma.organization.create({
      data: { name: `Auth ${RUN_ID}`, slug: `auth-${RUN_ID}` },
    });
    createdOrgIds.push(org.id);

    const user = await prisma.user.create({
      data: {
        firstName: "Auth",
        lastName: "Admin",
        email: `auth-admin-${RUN_ID}@example.com`,
        passwordHash: "not-a-real-hash",
        role: "ORG_ADMIN",
        organizationId: org.id,
      },
    });

    const secret = process.env.JWT_SECRET!;

    // -------------------------------------------------------------------
    // authenticate
    // -------------------------------------------------------------------
    const validPayload: JwtPayload = {
      userId: user.id,
      organizationId: org.id,
      role: "ORG_ADMIN",
    };

    let result = await runAuthenticate(makeReq({}));
    assert.equal(result.statusCode, 401, "[auth] missing token must be 401");
    assert.equal(result.nextCalled, false, "[auth] missing token must not call next");

    result = await runAuthenticate(makeReq({ accessToken: "not-a-jwt" }));
    assert.equal(result.statusCode, 401, "[auth] malformed token must be 401");

    const expired = jwt.sign(validPayload, secret, { expiresIn: "-10s" });
    result = await runAuthenticate(makeReq({ accessToken: expired }));
    assert.equal(result.statusCode, 401, "[auth] expired token must be 401");

    result = await runAuthenticate(
      makeReq({ accessToken: signAccessToken(validPayload) })
    );
    assert.equal(result.nextCalled, true, "[auth] valid token must call next");
    assert.equal(result.user?.userId, user.id, "[auth] req.user must be populated");

    result = await runAuthenticate(
      makeReq({
        accessToken: signAccessToken({
          userId: user.id,
          organizationId: "some-other-org",
          role: "ORG_ADMIN",
        }),
      })
    );
    assert.equal(result.statusCode, 403, "[auth] token whose org no longer matches must be 403");
    assert.equal(result.nextCalled, false, "[auth] mismatched org must not call next");

    result = await runAuthenticate(
      makeReq({
        accessToken: signAccessToken({
          userId: "ck_nonexistent_user_000",
          organizationId: null,
          role: "ORG_ADMIN",
        }),
      })
    );
    assert.equal(result.statusCode, 403, "[auth] unknown user id must be 403");

    await prisma.user.update({ where: { id: user.id }, data: { isActive: false } });
    result = await runAuthenticate(
      makeReq({ accessToken: signAccessToken(validPayload) })
    );
    assert.equal(result.statusCode, 403, "[auth] deactivated user must be 403");
    await prisma.user.update({ where: { id: user.id }, data: { isActive: true } });

    console.log("OK  authenticate: missing/invalid/expired rejected, org/deactivation enforced, valid passes");

    // -------------------------------------------------------------------
    // authorize (role matrix)
    // -------------------------------------------------------------------
    const tenantReq = makeReq({}, { userId: user.id, organizationId: org.id, role: "ORG_ADMIN" });
    const superReq = makeReq({}, { userId: "super", organizationId: null, role: "SUPER_ADMIN" });

    assert.equal(
      runAuthorize(["ORG_ADMIN"], tenantReq).nextCalled,
      true,
      "[authorize] ORG_ADMIN must pass tenant guard"
    );
    let authz = runAuthorize(["SUPER_ADMIN"], tenantReq);
    assert.equal(authz.statusCode, 403, "[authorize] ORG_ADMIN must not pass admin guard");
    assert.equal(authz.nextCalled, false, "[authorize] forbidden role must not call next");

    authz = runAuthorize(["ORG_ADMIN", "AGENT"], superReq);
    assert.equal(authz.statusCode, 403, "[authorize] SUPER_ADMIN must not pass tenant guard");
    assert.equal(authz.nextCalled, false, "[authorize] SUPER_ADMIN on tenant guard must not call next");

    assert.equal(
      runAuthorize(["SUPER_ADMIN"], superReq).nextCalled,
      true,
      "[authorize] SUPER_ADMIN must pass admin guard"
    );

    authz = runAuthorize(["ORG_ADMIN"], makeReq({}));
    assert.equal(authz.statusCode, 401, "[authorize] unauthenticated must be 401");

    console.log("OK  authorize: SUPER_ADMIN confined to admin routes, tenant roles confined to tenant routes");

    // -------------------------------------------------------------------
    // requireOrganizationId (SUPER_ADMIN cannot cross the tenant boundary)
    // -------------------------------------------------------------------
    let thrown: unknown = null;
    try {
      requireOrganizationId({ user: { organizationId: null } });
    } catch (error) {
      thrown = error;
    }
    assert.ok(thrown instanceof AppError, "[requireOrganizationId] must throw AppError for null org");
    assert.equal((thrown as AppError).statusCode, 403, "[requireOrganizationId] null org must be 403");

    assert.equal(
      requireOrganizationId({ user: { organizationId: org.id } }),
      org.id,
      "[requireOrganizationId] must return the organization id when present"
    );

    console.log("OK  requireOrganizationId: null-org (SUPER_ADMIN) session rejected with 403");

    // -------------------------------------------------------------------
    // refresh-token rotation: atomic single-use consumption
    // -------------------------------------------------------------------
    const raw = generateRefreshToken();
    await storeRefreshToken(user.id, raw);

    // Both "concurrent" reads observe the token as valid before either claims.
    assert.ok(await findValidRefreshToken(raw), "[rotation] token must be valid before rotation");
    assert.ok(await findValidRefreshToken(raw), "[rotation] token must be valid for a racing read");

    const claim1 = await revokeRefreshToken(raw);
    const claim2 = await revokeRefreshToken(raw);

    assert.equal(claim1?.count, 1, "[rotation] first refresh must win the claim");
    assert.equal(claim2?.count, 0, "[rotation] second concurrent refresh must lose the claim");
    assert.equal(await findValidRefreshToken(raw), null, "[rotation] consumed token must be unusable");

    // Expired refresh tokens are rejected.
    const expiredRaw = generateRefreshToken();
    await storeRefreshToken(user.id, expiredRaw);
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashRefreshToken(expiredRaw) },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    assert.equal(
      await findValidRefreshToken(expiredRaw),
      null,
      "[rotation] expired token must be rejected"
    );

    // Explicitly revoked refresh tokens are rejected.
    const revokedRaw = generateRefreshToken();
    await storeRefreshToken(user.id, revokedRaw);
    await revokeRefreshToken(revokedRaw);
    assert.equal(
      await findValidRefreshToken(revokedRaw),
      null,
      "[rotation] revoked token must be rejected"
    );

    console.log("OK  refresh: rotation is single-use (atomic), expired/revoked tokens rejected");

    // -------------------------------------------------------------------
    // refresh() handler: real production path via request/response harness
    // -------------------------------------------------------------------
    const liveTokens = () =>
      prisma.refreshToken.count({
        where: { userId: user.id, revokedAt: null, expiresAt: { gt: new Date() } },
      });

    // Guard: missing cookie -> 401, both cookies cleared, nothing issued.
    {
      const res = makeRefreshRes();
      await callRefresh(res, {});
      assert.equal(res.statusCode, 401, "[refresh] missing cookie must be 401");
      assert.equal(res.cookiesSet.length, 0, "[refresh] missing cookie must not set cookies");
      assert.deepEqual(
        [...res.cookiesCleared].sort(),
        ["accessToken", "refreshToken"],
        "[refresh] missing cookie must clear both cookies"
      );
    }

    // Guard: unknown/invalid token -> 401, both cookies cleared, nothing issued.
    {
      const res = makeRefreshRes();
      await callRefresh(res, { refreshToken: "definitely-not-a-valid-token" });
      assert.equal(res.statusCode, 401, "[refresh] invalid token must be 401");
      assert.equal(res.cookiesSet.length, 0, "[refresh] invalid token must not set cookies");
      assert.deepEqual(
        [...res.cookiesCleared].sort(),
        ["accessToken", "refreshToken"],
        "[refresh] invalid token must clear both cookies"
      );
    }

    // Success path: valid token -> 200, new access+refresh cookies, one rotation.
    {
      const rawOk = generateRefreshToken();
      await storeRefreshToken(user.id, rawOk);
      assert.equal(await liveTokens(), 1, "[refresh] fixture token must be live");

      const res = makeRefreshRes();
      const errors = await callRefresh(res, { refreshToken: rawOk });

      assert.equal(errors.length, 0, "[refresh] success path must not call next(error)");
      assert.equal(res.statusCode, 200, "[refresh] valid token must return 200");
      assert.deepEqual(
        [...res.cookiesSet].sort(),
        ["accessToken", "refreshToken"],
        "[refresh] success path must set both cookies"
      );
      assert.ok(
        (res.body as { id?: string })?.id === user.id,
        "[refresh] success path must return the current user"
      );
      assert.equal(
        await findValidRefreshToken(rawOk),
        null,
        "[refresh] old token must be revoked after rotation"
      );
      assert.equal(await liveTokens(), 1, "[refresh] success path must leave exactly one live token");
    }

    // Rotation guard under concurrency: N simultaneous refreshes with the SAME
    // token must yield exactly one success. Every loser is rejected with 401,
    // has both cookies cleared, and must not issue or store a replacement token
    // (only the winner rotates one token out and one in).
    {
      const rawRace = generateRefreshToken();
      await storeRefreshToken(user.id, rawRace);
      const before = await liveTokens();

      const CONCURRENCY = 8;
      const responses = Array.from({ length: CONCURRENCY }, () => makeRefreshRes());
      await Promise.all(responses.map((res) => callRefresh(res, { refreshToken: rawRace })));

      const successes = responses.filter((r) => r.statusCode === 200);
      const failures = responses.filter((r) => r.statusCode === 401);

      assert.equal(
        successes.length,
        1,
        `[rotation guard] exactly one concurrent refresh may succeed (got ${successes.length})`
      );
      assert.equal(
        failures.length,
        CONCURRENCY - 1,
        "[rotation guard] every other concurrent refresh must be rejected with 401"
      );

      for (const loser of failures) {
        assert.equal(
          loser.cookiesSet.length,
          0,
          "[rotation guard] rejected refresh must not issue replacement cookies"
        );
        assert.deepEqual(
          [...loser.cookiesCleared].sort(),
          ["accessToken", "refreshToken"],
          "[rotation guard] rejected refresh must clear both cookies"
        );
      }

      assert.equal(
        await liveTokens(),
        before,
        "[rotation guard] losers must not store tokens (one rotated in, one rotated out)"
      );
      assert.equal(
        await findValidRefreshToken(rawRace),
        null,
        "[rotation guard] the shared token must end revoked"
      );
    }

    console.log("OK  refresh: controller guard rejects missing/invalid/losing tokens; success rotates once");

    console.log("PASS: authentication and authorization checks passed");
  } finally {
    await prisma.refreshToken.deleteMany({
      where: { user: { organization: { id: { in: createdOrgIds } } } },
    });
    await prisma.user.deleteMany({ where: { organizationId: { in: createdOrgIds } } });
    await prisma.organization.deleteMany({ where: { id: { in: createdOrgIds } } });
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("FAIL:", error);
  process.exit(1);
});
