/**
 * Query keys for admin API
 */
export const adminKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminKeys.all, "dashboard"] as const,
  organizations: (params?: { page: number; pageSize: number; search?: string }) => [...adminKeys.all, "organizations", params] as const,
  organization: (id: string) => [...adminKeys.all, "organizations", id] as const,
  users: (params?: { page: number; pageSize: number; search?: string; organizationId?: string; role?: string }) => [...adminKeys.all, "users", params] as const,
};
