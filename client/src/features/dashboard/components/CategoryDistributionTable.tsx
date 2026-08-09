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

import type { DashboardCategoryDistributionItem } from "../types/dashboard.types";

interface CategoryDistributionTableProps {
  data: DashboardCategoryDistributionItem[];
}

export function CategoryDistributionTable({ data }: CategoryDistributionTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.categoryId}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">{item.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}