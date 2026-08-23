import { useState, useEffect } from "react";
import { Edit, Trash2, Search, Power, PowerOff } from "lucide-react";

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
import { useAuth } from "@/features/auth/context/AuthContext";
import { useActivateRequester } from "../hooks/useActivateRequester";
import { useDeactivateRequester } from "../hooks/useDeactivateRequester";
import { useDeleteRequester } from "../hooks/useDeleteRequester";

import type { Requester } from "../types/requester.types";
import type { PaginationMeta } from "@/types/pagination.types";

interface RequestersTableProps {
  requesters: Requester[];
  meta: PaginationMeta;
  isLoading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onEditRequester: (requester: Requester) => void;
}

export function RequestersTable({
  requesters,
  meta,
  isLoading,
  search,
  onSearchChange,
  onPageChange,
  onEditRequester,
}: RequestersTableProps) {
  const { user } = useAuth();
  const canManageRequesters = user?.role === "ORG_ADMIN" || user?.role === "SUPER_ADMIN" || user?.role === "AGENT";

  const activateMutation = useActivateRequester();
  const deactivateMutation = useDeactivateRequester();
  const deleteMutation = useDeleteRequester();

  // Debounced search input
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this requester? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search requesters..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              {canManageRequesters && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && requesters.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={canManageRequesters ? 6 : 5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading requesters...
                </TableCell>
              </TableRow>
            ) : requesters.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={canManageRequesters ? 6 : 5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No requesters found.
                </TableCell>
              </TableRow>
            ) : (
              requesters.map((requester) => (
                <TableRow key={requester.id}>
                  <TableCell className="font-medium">
                    {requester.firstName} {requester.lastName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{requester.email}</TableCell>
                  <TableCell className="text-muted-foreground">{requester.phone || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{requester.company || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={requester.isActive ? "secondary" : "outline"}>
                      {requester.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  {canManageRequesters && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEditRequester(requester)}
                          title="Edit requester"
                        >
                          <Edit className="size-4" />
                        </Button>
                        {requester.isActive ? (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => deactivateMutation.mutate(requester.id)}
                            disabled={deactivateMutation.isPending}
                            title="Deactivate requester"
                          >
                            <PowerOff className="size-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => activateMutation.mutate(requester.id)}
                            disabled={activateMutation.isPending}
                            title="Activate requester"
                          >
                            <Power className="size-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(requester.id)}
                          disabled={deleteMutation.isPending}
                          title="Delete requester"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {requesters.length === 0 ? 0 : (meta.page - 1) * meta.pageSize + 1} to{" "}
          {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total} requesters
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Number(meta.page) - 1)}
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
            onClick={() => onPageChange(Number(meta.page) + 1)}
            disabled={meta.page >= meta.totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
