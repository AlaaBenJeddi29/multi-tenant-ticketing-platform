import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useSlas } from "../hooks/useSlas";
import { SlaTable } from "../components/SlaTable";
import { SlaFormDialog } from "../components/SlaFormDialog";

import type { Sla } from "../types/sla.types";

export default function SlasPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ORG_ADMIN" || user?.role === "SUPER_ADMIN";

  // State for query parameters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSla, setSelectedSla] = useState<Sla | null>(null);

  // Fetch SLAs with current filters
  const { data, isLoading } = useSlas({
    page,
    pageSize: 20,
    sortBy: "name",
    sortOrder: "asc",
    search: search || undefined,
  });

  const handleNewSla = () => {
    setSelectedSla(null);
    setDialogOpen(true);
  };

  const handleEditSla = (sla: Sla) => {
    setSelectedSla(sla);
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
          <h1 className="text-3xl font-bold text-foreground">SLAs</h1>
          <p className="mt-2 text-muted-foreground">
            Configure Service Level Agreements for each priority level
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleNewSla}>
            <Plus className="mr-2 size-4" />
            New SLA
          </Button>
        )}
      </div>

      {/* Table */}
      <SlaTable
        slas={data?.data || []}
        meta={
          data?.meta || {
            page: 1,
            pageSize: 20,
            total: 0,
            totalPages: 0,
          }
        }
        isLoading={isLoading}
        search={search}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
        onEditSla={handleEditSla}
      />

      {/* Form Dialog */}
      {isAdmin && (
        <SlaFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          sla={selectedSla}
          existingSlas={data?.data || []}
        />
      )}
    </div>
  );
}
