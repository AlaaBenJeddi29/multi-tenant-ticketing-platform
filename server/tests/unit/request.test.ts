import { describe, expect, it } from "vitest";

import { AppError } from "../../src/lib/AppError.js";
import { requireOrganizationId } from "../../src/lib/request.js";

describe("requireOrganizationId", () => {
  it("throws AppError with status 403 when organizationId is null", () => {
    let thrown: unknown;

    try {
      requireOrganizationId({ user: { organizationId: null } });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(AppError);
    expect((thrown as AppError).statusCode).toBe(403);
  });

  it("throws AppError with status 403 when there is no user at all", () => {
    let thrown: unknown;

    try {
      requireOrganizationId({});
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(AppError);
    expect((thrown as AppError).statusCode).toBe(403);
  });

  it("returns the organization id when one is present", () => {
    expect(
      requireOrganizationId({ user: { organizationId: "org_123" } })
    ).toBe("org_123");
  });
});
