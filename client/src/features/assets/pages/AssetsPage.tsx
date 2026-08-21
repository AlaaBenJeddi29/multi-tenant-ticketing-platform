import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useAssets } from "../hooks/useAssets";
import { AssetsTable } from "../components/AssetsTable";
import { AssetFormDialog } from "../components/AssetFormDialog";

import type { Asset } from "../types/asset.types";

export default function AssetsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ORG_ADMIN" || user?.role === "SUPER_ADMIN";

  // State for query parameters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Fetch assets with current filters
  const { data, isLoading } = useAssets({
    page,
    pageSize: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: search || undefined,
  });

  const handleNewAsset = () => {
    setSelectedAsset(null);
    setDialogOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
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
          <h1 className="text-3xl font-bold text-foreground">Assets</h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage organizational assets and equipment
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleNewAsset}>
            <Plus className="mr-2 size-4" />
            New Asset
          </Button>
        )}
      </div>

      {/* Table */}
      <AssetsTable
        assets={data?.data || []}
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
        onEditAsset={handleEditAsset}
      />

      {/* Form Dialog */}
      {isAdmin && (
        <AssetFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          asset={selectedAsset}
        />
      )}
    </div>
  );
}
