/**
 * Query keys for admin API
 */
export const adminKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminKeys.all, "dashboard"] as const,
  organizations: () => [...adminKeys.all, "organizations"] as const,
  organization: (id: string) => [...adminKeys.all, "organizations", id] as const,
  users: () => [...adminKeys.all, "users"] as const,
};
