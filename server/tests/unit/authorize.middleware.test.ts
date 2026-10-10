import type { NextFunction, Response } from "express";
import { describe, expect, it, vi, type Mock } from "vitest";

import { authorize } from "../../src/middleware/authorize.middleware.js";
import type {
  AuthenticatedRequest,
  JwtPayload,
} from "../../src/middleware/auth.middleware.js";

type MockResponse = {
  status: Mock;
  json: Mock;
};

function createResponse(): MockResponse {
  const res: MockResponse = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);

  return res;
}

function createRequest(user?: JwtPayload): AuthenticatedRequest {
  return { user } as unknown as AuthenticatedRequest;
}

const agentUser: JwtPayload = {
  userId: "user_agent_1",
  organizationId: "org_1",
  role: "AGENT",
};

describe("authorize middleware", () => {
  it("returns 401 when there is no authenticated user", () => {
    const req = createRequest();
    const res = createResponse();
    const next = vi.fn() as unknown as NextFunction;

    authorize("ORG_ADMIN")(req, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Authentication required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when the authenticated user's role is not allowed", () => {
    const req = createRequest(agentUser);
    const res = createResponse();
    const next = vi.fn() as unknown as NextFunction;

    authorize("ORG_ADMIN")(req, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next() when the user's role is allowed", () => {
    const req = createRequest(agentUser);
    const res = createResponse();
    const next = vi.fn() as unknown as NextFunction;

    authorize("ORG_ADMIN", "AGENT")(req, res as unknown as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
