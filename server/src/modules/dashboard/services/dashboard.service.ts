import {
  getDashboardOverview,
} from "../repositories/dashboard.repository.js";

import {
  toDashboardOverviewResponse,
} from "../mappers/dashboard.mapper.js";

export async function getDashboard(
  organizationId: string
) {
  const dashboard =
    await getDashboardOverview(
      organizationId
    );

  return toDashboardOverviewResponse(
    dashboard
  );
}