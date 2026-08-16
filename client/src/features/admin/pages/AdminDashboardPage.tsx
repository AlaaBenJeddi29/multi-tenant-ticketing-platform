import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useAdminDashboard } from "../hooks/useAdminDashboard";

export default function AdminDashboardPage() {
  const { data, isPending, isError, error } = useAdminDashboard();

  if (isPending) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-24" />
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

  const kpiCards = [
    { label: "Total Organizations", value: data.totalOrganizations },
    { label: "Active Organizations", value: data.activeOrganizations },
    { label: "Total Users", value: data.totalUsers },
    { label: "Active Users", value: data.activeUsers },
    { label: "Tickets on Platform", value: data.totalTickets },
    { label: "Created Today", value: data.ticketsCreatedToday },
    { label: "SLA Breach Rate", value: `${data.slaBreachRate}%` },
  ];

  // Format ticket volume data for chart - show every 5th label
  const ticketVolumeData = data.ticketVolumeByDay
    .map((item: { date: string; count: number }) => ({
      date: item.date,
      count: item.count,
    }))
    .reverse();

  // Format top organizations data
  const topOrgsData = data.topOrganizationsByTickets.map((org: { id: string; name: string; ticketCount: number }) => ({
    name: org.name,
    tickets: org.ticketCount,
  }));

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Platform Dashboard</h1>

      {/* Row 1 - KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        {kpiCards.map((card) => (
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

      {/* Row 2 - Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Ticket Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Volume (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ticketVolumeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value: string, index: number) => (index % 5 === 0 ? value : "")}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Organizations Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Organizations by Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topOrgsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" width={120} className="text-xs" />
                <Tooltip />
                <Bar
                  dataKey="tickets"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.7}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 - Summary Strip */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-around gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">New organizations this month</p>
              <p className="text-2xl font-bold">{data.newOrganizationsThisMonth}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Tickets resolved today</p>
              <p className="text-2xl font-bold">{data.ticketsResolvedToday}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Platform SLA breach rate</p>
              <p className="text-2xl font-bold">{data.slaBreachRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
