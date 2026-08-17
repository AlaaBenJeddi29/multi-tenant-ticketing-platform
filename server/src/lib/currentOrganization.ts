import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export function currentOrganization(req: AuthenticatedRequest): string | null {
  return req.user!.organizationId;
}