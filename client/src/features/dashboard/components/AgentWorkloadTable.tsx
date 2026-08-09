import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { DashboardAgentWorkloadItem } from "../types/dashboard.types";

interface AgentWorkloadTableProps {
  data: DashboardAgentWorkloadItem[];
}

export function AgentWorkloadTable({ data }: AgentWorkloadTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Workload</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Assigned Tickets</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.agentId ?? "unknown"}>
                <TableCell>{item.agentName}</TableCell>
                <TableCell className="text-right">{item.ticketCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}