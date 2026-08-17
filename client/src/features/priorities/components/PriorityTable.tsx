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
import { useActivatePriority } from "../hooks/useActivatePriority";
import { useDeactivatePriority } from "../hooks/useDeactivatePriority";
import { useDeletePriority } from "../hooks/useDeletePriority";

import type { Priority } from "../types/priority.types";
import type { PaginationMeta } from "@/types/pagination.types";

interface PriorityTableProps {
  priorities: Priority[];
  meta: PaginationMeta;
  isLoading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onEditPriority: (priority: Priority) => void;
}

export function PriorityTable({
  priorities,
  meta,
  isLoading,
  search,
  onSearchChange,
  onPageChange,
  onEditPriority,
}: PriorityTableProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ORG_ADMIN" || user?.role === "SUPER_ADMIN";

  const activateMutation = useActivatePriority();
  const deactivateMutation = useDeactivatePriority();
  const deleteMutation = useDeletePriority();

  // Debounced search input
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  const handleToggleActive = (priority: Priority) => {
    if (priority.isActive) {
      deactivateMutation.mutate(priority.id);
    } else {
      activateMutation.mutate(priority.id);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this priority?")) {
      deleteMutation.mutate(id);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "bg-green-500 hover:bg-green-600";
      case "MEDIUM":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "HIGH":
        return "bg-orange-500 hover:bg-orange-600";
      case "CRITICAL":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search priorities..."
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
              <TableHead>Level</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Response Time</TableHead>
              <TableHead>Resolution Time</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && priorities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading priorities...
                </TableCell>
              </TableRow>
            ) : priorities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No priorities found.
                </TableCell>
              </TableRow>
            ) : (
              priorities.map((priority) => (
                <TableRow key={priority.id}>
                  <TableCell className="font-medium">
                    {priority.name}
                  </TableCell>
                  <TableCell>
                    <Badge className={getLevelBadgeColor(priority.level)}>
                      {priority.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="size-4 rounded-full border"
                        style={{ backgroundColor: priority.color }}
                      />
                      <span className="text-sm text-muted-foreground">{priority.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {priority.responseTimeMinutes} min
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {priority.resolutionTimeMinutes} min
                  </TableCell>
                  <TableCell>
                    <Badge variant={priority.isActive ? "secondary" : "outline"}>
                      {priority.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEditPriority(priority)}
                          title="Edit priority"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleToggleActive(priority)}
                          disabled={
                            activateMutation.isPending ||
                            deactivateMutation.isPending
                          }
                          title={
                            priority.isActive
                              ? "Deactivate priority"
                              : "Activate priority"
                          }
                        >
                          {priority.isActive ? (
                            <PowerOff className="size-4" />
                          ) : (
                            <Power className="size-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(priority.id)}
                          disabled={deleteMutation.isPending}
                          title="Delete priority"
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
          Showing {priorities.length === 0 ? 0 : (Number(meta.page) - 1) * Number(meta.pageSize) + 1} to{" "}
          {Math.min(Number(meta.page) * Number(meta.pageSize), Number(meta.total))} of {Number(meta.total)}{" "}
          priorities
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
