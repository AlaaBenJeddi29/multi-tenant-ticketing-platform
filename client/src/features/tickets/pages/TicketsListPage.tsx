import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTickets } from "../hooks/useTickets";
import { usePriorities } from "@/features/priorities/hooks/usePriorities";
import { TicketsTable } from "../components/TicketsTable";

import type { TicketStatus } from "../types/ticket.types";

export default function TicketsListPage() {
  const navigate = useNavigate();

  // State for query parameters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TicketStatus | undefined>();
  const [priorityId, setPriorityId] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [assignedToId, setAssignedToId] = useState<string | undefined>();

  // Fetch tickets with current filters
  const { data, isLoading } = useTickets({
    page,
    pageSize: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: search || undefined,
    status,
    priorityId,
    categoryId,
    assignedToId,
  });

  // Fetch priorities for table filters
  const { data: prioritiesData } = usePriorities({ isActive: true });

  const handleFiltersChange = (filters: {
    search?: string;
    status?: TicketStatus | undefined;
    priorityId?: string | undefined;
    categoryId?: string | undefined;
    assignedToId?: string | undefined;
  }) => {
    if (filters.search !== undefined) {
      setSearch(filters.search);
      setPage(1); // Reset to first page on search
    }
    if (filters.status !== undefined) {
      setStatus(filters.status);
      setPage(1);
    }
    if (filters.priorityId !== undefined) {
      setPriorityId(filters.priorityId);
      setPage(1);
    }
    if (filters.categoryId !== undefined) {
      setCategoryId(filters.categoryId);
      setPage(1);
    }
    if (filters.assignedToId !== undefined) {
      setAssignedToId(filters.assignedToId);
      setPage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleNewTicket = () => {
    navigate("/tickets/new");
  };

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tickets</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage support tickets
          </p>
        </div>
        <Button onClick={handleNewTicket}>
          <Plus className="mr-2 size-4" />
          New Ticket
        </Button>
      </div>

      {/* Table */}
      <TicketsTable
        tickets={data?.data || []}
        meta={
          data?.meta || {
            page: 1,
            pageSize: 20,
            total: 0,
            totalPages: 0,
          }
        }
        isLoading={isLoading}
        filters={{
          search,
          status,
          priorityId,
          categoryId,
          assignedToId,
        }}
        onFiltersChange={handleFiltersChange}
        onPageChange={handlePageChange}
        priorities={prioritiesData?.data || []}
      />
    </div>
  );
}
