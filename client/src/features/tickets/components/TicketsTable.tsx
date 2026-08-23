import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCategories } from "@/features/categories/hooks/useCategories";

import type { Ticket, TicketStatus } from "../types/ticket.types";
import type { PaginationMeta } from "@/types/pagination.types";
import { useUsersList } from "@/features/users/hooks/useUsersList";

interface TicketsTableProps {
  tickets: Ticket[];
  meta: PaginationMeta;
  isLoading: boolean;
  filters: {
    search: string;
    status?: TicketStatus;
    priorityId?: string;
    categoryId?: string;
    assignedToId?: string;
  };
  onFiltersChange: (filters: {
    search?: string;
    status?: TicketStatus | undefined;
    priorityId?: string | undefined;
    categoryId?: string | undefined;
    assignedToId?: string | undefined;
  }) => void;
  onPageChange: (page: number) => void;
  priorities: Array<{ id: string; name: string; color: string }>;
}

const STATUS_BADGE_VARIANT: Record<
  TicketStatus,
  "default" | "secondary" | "outline"
> = {
  NEW: "default",
  IN_PROGRESS: "secondary",
  WAITING_REQUESTER: "outline",
  RESOLVED: "secondary",
  CLOSED: "outline",
};

export function TicketsTable({
  tickets,
  meta,
  isLoading,
  filters,
  onFiltersChange,
  onPageChange,
  priorities,
}: TicketsTableProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Debounced search input
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ search: searchInput });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useCategories({
    page: 1,
    pageSize: 100,
    sortBy: "name",
    sortOrder: "asc",
    isActive: true,
  });

  // Fetch users for assignee filter dropdown
  const { data: usersData } = useUsersList({
    page: 1,
    pageSize: 100,
    sortBy: "lastName",
    sortOrder: "asc",
    isActive: true,
  });

  // Filter out current user from assignee list
  const filteredUsers = usersData?.data?.filter(
    (u) => u.id !== user?.id
  ) || [];

  const handleRowClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              status: value === "all" ? undefined : (value as TicketStatus),
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="WAITING_REQUESTER">Waiting Requester</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={filters.priorityId || "all"}
          onValueChange={(value) =>
            onFiltersChange({ priorityId: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {priorities.map((priority) => (
              <SelectItem key={priority.id} value={priority.id}>
                {priority.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={filters.categoryId || "all"}
          onValueChange={(value) =>
            onFiltersChange({ categoryId: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoriesData?.data.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Assignee Filter */}
        <Select
          value={filters.assignedToId || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              assignedToId: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {filteredUsers.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket #</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>SLA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Loading tickets...
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(ticket.id)}
                >
                  <TableCell className="font-medium">
                    {ticket.ticketNumber}
                  </TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE_VARIANT[ticket.status]}>
                      {ticket.status.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="size-2 rounded-full"
                        style={{ backgroundColor: ticket.priority.color }}
                      />
                      <span>{ticket.priority.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ticket.assignedTo
                      ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                      : "Unassigned"}
                  </TableCell>
                  <TableCell>
                    {(ticket.responseBreached || ticket.resolutionBreached) && (
                      <Badge variant="destructive" className="text-xs">
                        SLA Breach
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {tickets.length === 0 ? 0 : (meta.page - 1) * meta.pageSize + 1} to{" "}
          {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total} tickets
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(meta.page - 1)}
            disabled={meta.page === 1 || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(meta.page + 1)}
            disabled={meta.page >= meta.totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
