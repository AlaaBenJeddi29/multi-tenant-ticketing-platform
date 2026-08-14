import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUsersList } from "../hooks/useUsersList";
import { UsersTable } from "../components/UsersTable";
import { CreateUserDialog } from "../components/CreateUserDialog";
import { EditUserDialog } from "../components/EditUserDialog";

import type { User, UserRole } from "../types/user.types";

/**
 * Users page - ORG_ADMIN only
 * Access control is enforced at the route level via RequireRole
 */
export default function UsersPage() {

  // State for query parameters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined);

  // State for dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users with current filters
  const { data, isLoading } = useUsersList({
    page,
    pageSize: 20,
    sortBy: "lastName",
    sortOrder: "asc",
    search: search || undefined,
    role: roleFilter,
  });

  const handleNewUser = () => {
    setCreateDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page on search
  };

  const handleRoleFilterChange = (role: UserRole | undefined) => {
    setRoleFilter(role);
    setPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="mt-2 text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button onClick={handleNewUser}>
          <Plus className="mr-2 size-4" />
          New User
        </Button>
      </div>

      {/* Table */}
      <UsersTable
        users={data?.data || []}
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
        roleFilter={roleFilter}
        onSearchChange={handleSearchChange}
        onRoleFilterChange={handleRoleFilterChange}
        onPageChange={handlePageChange}
        onEditUser={handleEditUser}
      />

      {/* Form Dialogs */}
      <CreateUserDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      {selectedUser && (
        <EditUserDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          user={selectedUser}
        />
      )}
    </div>
  );
}
