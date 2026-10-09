import { AppError } from "./AppError.js";

export function getParam(value: string | string[] | undefined): string {
  if (!value) {
    throw new Error("Missing parameter");
  }

  return Array.isArray(value)
    ? value[0]
    : value;
}

interface OrganizationContext {
  user?: {
    organizationId: string | null;
  };
}

/**
 * Resolves the authenticated caller's organization id for a tenant-scoped
 * operation.
 *
 * Every tenant endpoint must run with an organization context; controllers must
 * reject the request before querying or modifying tenant data otherwise. A
 * SUPER_ADMIN session intentionally carries `organizationId: null` and is
 * served exclusively by the administrative routes, so reaching a tenant
 * operation without an organization is a forbidden request rather than a
 * server error.
 */
export function requireOrganizationId(req: OrganizationContext): string {
  const organizationId = req.user?.organizationId;

  if (!organizationId) {
    throw new AppError(
      403,
      "Organization context is required for this operation."
    );
  }

  return organizationId;
}
