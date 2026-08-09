// Keyed by tenantId so a cached response can never leak across
// organizations if the auth context ever changes mid-session.
export const dashboardKeys = {
  all: (tenantId: string) => ["dashboard", tenantId] as const,
  overview: (tenantId: string) =>
    [...dashboardKeys.all(tenantId), "overview"] as const,
};