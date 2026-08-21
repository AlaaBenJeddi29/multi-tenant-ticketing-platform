import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCategories } from "../hooks/useCategories";
import { CategoryTable } from "../components/CategoryTable";
import { CategoryFormDialog } from "../components/CategoryFormDialog";

import type { Category } from "../types/category.types";

export default function CategoriesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ORG_ADMIN" || user?.role === "SUPER_ADMIN";

  // State for query parameters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Fetch categories with current filters
  const { data, isLoading } = useCategories({
    page,
    pageSize: 8,
    sortBy: "name",
    sortOrder: "asc",
    search: search || undefined,
  });

  const handleNewCategory = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
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
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="mt-2 text-muted-foreground">
            Manage ticket categories for your organization
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleNewCategory}>
            <Plus className="mr-2 size-4" />
            New Category
          </Button>
        )}
      </div>

      {/* Table */}
      <CategoryTable
        categories={data?.data || []}
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
        onEditCategory={handleEditCategory}
      />

      {/* Form Dialog */}
      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
      />
    </div>
  );
}
