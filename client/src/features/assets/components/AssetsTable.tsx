import { useState, useEffect } from "react";
import { Edit, Trash2, Search, Wrench, Power, Archive } from "lucide-react";

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
import { useActivateAsset } from "../hooks/useActivateAsset";
import { useMaintenanceAsset } from "../hooks/useMaintenanceAsset";
import { useRetireAsset } from "../hooks/useRetireAsset";
import { useDeleteAsset } from "../hooks/useDeleteAsset";

import type { Asset } from "../types/asset.types";
import type { PaginationMeta } from "@/types/pagination.types";

interface AssetsTableProps {
  assets: Asset[];
  meta: PaginationMeta;
  isLoading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onEditAsset: (asset: Asset) => void;
}

export function AssetsTable({
  assets,
  meta,
  isLoading,
  search,
  onSearchChange,
  onPageChange,
  onEditAsset,
}: AssetsTableProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ORG_ADMIN" || user?.role === "SUPER_ADMIN";

  const activateMutation = useActivateAsset();
  const maintenanceMutation = useMaintenanceAsset();
  const retireMutation = useRetireAsset();
  const deleteMutation = useDeleteAsset();

  // Debounced search input
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this asset? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="secondary">Active</Badge>;
      case "IN_MAINTENANCE":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">In Maintenance</Badge>;
      case "RETIRED":
        return <Badge variant="outline" className="border-gray-500 text-gray-600">Retired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
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
              <TableHead>Asset Tag</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && assets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading assets...
                </TableCell>
              </TableRow>
            ) : assets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No assets found.
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.assetTag}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.manufacturer || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.model || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.location || "—"}</TableCell>
                  <TableCell>{getStatusBadge(asset.status)}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEditAsset(asset)}
                          title="Edit asset"
                        >
                          <Edit className="size-4" />
                        </Button>
                        {asset.status === "ACTIVE" && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => maintenanceMutation.mutate(asset.id)}
                            disabled={maintenanceMutation.isPending}
                            title="Set to maintenance"
                          >
                            <Wrench className="size-4" />
                          </Button>
                        )}
                        {asset.status === "IN_MAINTENANCE" && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => activateMutation.mutate(asset.id)}
                            disabled={activateMutation.isPending}
                            title="Activate asset"
                          >
                            <Power className="size-4" />
                          </Button>
                        )}
                        {asset.status !== "RETIRED" && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => retireMutation.mutate(asset.id)}
                            disabled={retireMutation.isPending}
                            title="Retire asset"
                          >
                            <Archive className="size-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(asset.id)}
                          disabled={deleteMutation.isPending}
                          title="Delete asset"
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
          Showing {assets.length === 0 ? 0 : (meta.page - 1) * meta.pageSize + 1} to{" "}
          {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total} assets
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
