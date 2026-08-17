import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useRequesters } from "../hooks/useRequesters";
import { RequestersTable } from "../components/RequestersTable";
import { RequesterFormDialog } from "../components/RequesterFormDialog";

import type { Requester } from "../types/requester.types";

export default function RequestersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ORG_ADMIN" || user?.role === "SUPER_ADMIN";

  // State for query parameters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequester, setSelectedRequester] = useState<Requester | null>(null);

  // Fetch requesters with current filters
  const { data, isLoading } = useRequesters({
    page,
    pageSize: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: search || undefined,
  });

  const handleNewRequester = () => {
    setSelectedRequester(null);
    setDialogOpen(true);
  };

  const handleEditRequester = (requester: Requester) => {
    setSelectedRequester(requester);
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
          <h1 className="text-3xl font-bold text-foreground">Requesters</h1>
          <p className="mt-2 text-muted-foreground">
            Manage requesters and their contact information
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleNewRequester}>
            <Plus className="mr-2 size-4" />
            New Requester
          </Button>
        )}
      </div>

      {/* Table */}
      <RequestersTable
        requesters={data?.data || []}
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
        onEditRequester={handleEditRequester}
      />

      {/* Form Dialog */}
      {isAdmin && (
        <RequesterFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          requester={selectedRequester}
        />
      )}
    </div>
  );
}
