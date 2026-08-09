import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { DashboardSla } from "../types/dashboard.types";

interface SlaCardProps {
  sla: DashboardSla;
}

export function SlaCard({ sla }: SlaCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SLA Breaches</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Response</span>
          <Badge variant={sla.responseBreached > 0 ? "destructive" : "secondary"}>
            {sla.responseBreached}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Resolution</span>
          <Badge variant={sla.resolutionBreached > 0 ? "destructive" : "secondary"}>
            {sla.resolutionBreached}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}