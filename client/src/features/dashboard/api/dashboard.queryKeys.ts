// Keyed by organizationId so a cached response can never leak across
// organizations if the auth context ever changes mid-session.
export const dashboardKeys = {
  all: (organizationId: string) => ["dashboard", organizationId] as const,
  overview: (organizationId: string) =>
    [...dashboardKeys.all(organizationId), "overview"] as const,
};