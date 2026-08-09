import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DashboardSummary } from "../types/dashboard.types";

interface SummaryCardsProps {
  summary: DashboardSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    { label: "Total Tickets", value: summary.totalTickets },
    { label: "New", value: summary.newTickets },
    { label: "In Progress", value: summary.inProgressTickets },
    { label: "Waiting on Requester", value: summary.waitingRequesterTickets },
    { label: "Resolved", value: summary.resolvedTickets },
    { label: "Closed", value: summary.closedTickets },
    { label: "Unassigned", value: summary.unassignedTickets },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}