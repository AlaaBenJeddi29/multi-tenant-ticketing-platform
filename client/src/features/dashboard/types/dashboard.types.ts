export type TicketStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "WAITING_REQUESTER"
  | "RESOLVED"
  | "CLOSED";

export interface DashboardSummary {
  totalTickets: number;
  newTickets: number;
  inProgressTickets: number;
  waitingRequesterTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  unassignedTickets: number;
}

export interface DashboardSla {
  responseBreached: number;
  resolutionBreached: number;
}

export interface DashboardStatusDistributionItem {
  status: TicketStatus;
  count: number;
}

export interface DashboardPriorityDistributionItem {
  priorityId: string;
  name: string;
  level: string;
  color: string | null;
  count: number;
}

export interface DashboardCategoryDistributionItem {
  categoryId: string;
  name: string;
  count: number;
}

export interface DashboardAgentWorkloadItem {
  agentId: string | null;
  agentName: string;
  ticketCount: number;
}

export interface DashboardOverview {
  summary: DashboardSummary;
  sla: DashboardSla;
  statusDistribution: DashboardStatusDistributionItem[];
  priorityDistribution: DashboardPriorityDistributionItem[];
  categoryDistribution: DashboardCategoryDistributionItem[];
  agentWorkload: DashboardAgentWorkloadItem[];
}