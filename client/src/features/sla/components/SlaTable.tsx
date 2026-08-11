import { useState, useEffect } from "react";
import { Edit, Power, PowerOff, Trash2, Search } from "lucide-react";

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
import { useActivateSla } from "../hooks/useActivateSla";
import { useDeactivateSla } from "../hooks/useDeactivateSla";
import { useDeleteSla } from "../hooks/useDeleteSla";
import { formatMinutes } from "../utils/time";

import type { Sla } from "../types/sla.types";
import type { PaginationMeta } from "@/types/pagination.types";

interface SlaTableProps {
  slas: Sla[];
  meta: PaginationMeta;
  isLoading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onEditSla: (sla: Sla) => void;
  prioritiesMap: Record<string, { name: string; color: string }>;
}

export function SlaTable({
  slas,
  meta,
  isLoading,
  search,
  onSearchChange,
  onPageChange,
  onEditSla,
  prioritiesMap,
}: SlaTableProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ORG_ADMIN" || user?.role === "SUPER_ADMIN";

  const activateMutation = useActivateSla();
  const deactivateMutation = useDeactivateSla();
  const deleteMutation = useDeleteSla();

  // Debounced search input
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  const handleToggleActive = (sla: Sla) => {
    if (sla.isActive) {
      deactivateMutation.mutate(sla.id);
    } else {
      activateMutation.mutate(sla.id);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this SLA? This action cannot be undone.")) {
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
            placeholder="Search SLAs..."
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
              <TableHead>Priority</TableHead>
              <TableHead>Response Time</TableHead>
              <TableHead>Resolution Time</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && slas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 6 : 5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading SLAs...
                </TableCell>
              </TableRow>
            ) : slas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 6 : 5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No SLAs found.
                </TableCell>
              </TableRow>
            ) : (
              slas.map((sla) => {
                const priority = prioritiesMap[sla.priorityId];
                return (
                  <TableRow key={sla.id}>
                    <TableCell className="font-medium">{sla.name}</TableCell>
                    <TableCell>
                      {priority ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2 rounded-full"
                            style={{ backgroundColor: priority.color }}
                          />
                          <span>{priority.name}</span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatMinutes(sla.responseTimeMinutes)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatMinutes(sla.resolutionTimeMinutes)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sla.isActive ? "secondary" : "outline"}>
                        {sla.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onEditSla(sla)}
                            title="Edit SLA"
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleToggleActive(sla)}
                            disabled={
                              activateMutation.isPending ||
                              deactivateMutation.isPending
                            }
                            title={
                              sla.isActive
                                ? "Deactivate SLA"
                                : "Activate SLA"
                            }
                          >
                            {sla.isActive ? (
                              <PowerOff className="size-4" />
                            ) : (
                              <Power className="size-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDelete(sla.id)}
                            disabled={deleteMutation.isPending}
                            title="Delete SLA"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {slas.length === 0 ? 0 : (meta.page - 1) * meta.pageSize + 1} to{" "}
          {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total} SLAs
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
