import { api } from "@/api/client";

import type { DashboardOverview } from "../types/dashboard.types";

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const response = await api.get<DashboardOverview>("/dashboard");
  return response.data;
}