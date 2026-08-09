import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DashboardStatusDistributionItem } from "../types/dashboard.types";

interface StatusDistributionCardProps {
  data: DashboardStatusDistributionItem[];
}

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  WAITING_REQUESTER: "Waiting on Requester",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export function StatusDistributionCard({ data }: StatusDistributionCardProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets by Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((item) => {
          const percent = Math.round((item.count / total) * 100);

          return (
            <div key={item.status} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{STATUS_LABELS[item.status] ?? item.status}</span>
                <span className="text-muted-foreground">{item.count}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}