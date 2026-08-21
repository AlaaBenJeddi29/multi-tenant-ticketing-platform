import { useState } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAutomationExecutions } from "../hooks/useAutomationExecutions";

/**
 * Automation execution history page - ORG_ADMIN only
 * Access control is enforced at the route level via RequireRole
 */
export default function AutomationExecutionsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const { data, isLoading } = useAutomationExecutions({ page, pageSize });

  const executions = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Automation Execution History</h1>
        <p className="mt-2 text-muted-foreground">
          View and audit automation rule executions
        </p>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : executions.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">No execution history found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Executed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executions.map((execution: any) => (
                  <TableRow key={execution.id}>
                    <TableCell className="font-medium">
                      {execution.automationRule?.name || "Unknown Rule"}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          #{execution.ticket?.ticketNumber} - {execution.ticket?.title}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground">
                        {execution.trigger}
                      </span>
                    </TableCell>
                    <TableCell>{formatDateTime(execution.executedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} executions
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
