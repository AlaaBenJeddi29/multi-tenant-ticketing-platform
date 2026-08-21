import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";
import { usePriorities } from "../hooks/usePriorities";
import { PriorityTable } from "../components/PriorityTable";
import { PriorityFormDialog } from "../components/PriorityFormDialog";

import type { Priority } from "../types/priority.types";

export default function PrioritiesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ORG_ADMIN" || user?.role === "SUPER_ADMIN";

  // State for query parameters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);

  // Fetch priorities with current filters
  const { data, isLoading } = usePriorities({
    page,
    pageSize: 8,
    sortBy: "level",
    sortOrder: "asc",
    search: search || undefined,
  });

  const handleNewPriority = () => {
    setSelectedPriority(null);
    setDialogOpen(true);
  };

  const handleEditPriority = (priority: Priority) => {
    setSelectedPriority(priority);
    setDialogOpen(true);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Priorities</h1>
          <p className="mt-2 text-muted-foreground">
            Manage ticket priority levels and SLA configurations
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleNewPriority}>
            <Plus className="mr-2 size-4" />
            New Priority
          </Button>
        )}
      </div>

      {/* Table */}
      <PriorityTable
        priorities={data?.data || []}
        meta={
          data?.meta || {
            page: 1,
            pageSize: 8,
            total: 0,
            totalPages: 0,
          }
        }
        isLoading={isLoading}
        search={search}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
        onEditPriority={handleEditPriority}
      />

      {/* Form Dialog */}
      <PriorityFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        priority={selectedPriority}
      />
    </div>
  );
}
