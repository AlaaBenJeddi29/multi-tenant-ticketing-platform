import { Skeleton } from "@/components/ui/skeleton";

import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { SummaryCards } from "../components/SummaryCards";
import { SlaCard } from "../components/SlaCard";
import { StatusDistributionCard } from "../components/StatusDistributionCard";
import { PriorityDistributionTable } from "../components/PriorityDistributionTable";
import { CategoryDistributionTable } from "../components/CategoryDistributionTable";
import { AgentWorkloadTable } from "../components/AgentWorkloadTable";

export default function DashboardPage() {
  const { data, isPending, isError, error } = useDashboardOverview();

  if (isPending) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-sm text-destructive">
        Failed to load dashboard: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <SummaryCards summary={data.summary} />

      <div className="grid gap-4 md:grid-cols-2">
        <SlaCard sla={data.sla} />
        <StatusDistributionCard data={data.statusDistribution} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PriorityDistributionTable data={data.priorityDistribution} />
        <CategoryDistributionTable data={data.categoryDistribution} />
      </div>

      <AgentWorkloadTable data={data.agentWorkload} />
    </div>
  );
}