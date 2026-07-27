import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export function currentOrganization(req: AuthenticatedRequest) {
  return req.user!.organizationId;
}