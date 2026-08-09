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

import type { DashboardPriorityDistributionItem } from "../types/dashboard.types";

interface PriorityDistributionTableProps {
  data: DashboardPriorityDistributionItem[];
}

export function PriorityDistributionTable({ data }: PriorityDistributionTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets by Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Priority</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="text-right">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.priorityId}>
                <TableCell className="flex items-center gap-2">
                  {item.color && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                  {item.name}
                </TableCell>
                <TableCell>{item.level}</TableCell>
                <TableCell className="text-right">{item.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}