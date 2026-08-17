import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAdminUsers } from "../hooks/useAdminUsers";
import { useAdminOrganizations } from "../hooks/useAdminOrganizations";
import { useToggleUserActive } from "../hooks/useToggleUserActive";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [role, setRole] = useState<string>("");
  const [organizationId, setOrganizationId] = useState<string>("");

  const { data, isLoading } = useAdminUsers({ page, pageSize, search, organizationId, role });
  const { data: orgsData } = useAdminOrganizations({ page: 1, pageSize: 100 });
  const toggleUserActiveMutation = useToggleUserActive();

  const users = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);
  const organizations = orgsData?.data || [];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLastLogin = (dateString: string | null) => {
    if (!dateString) return "Never";
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleToggleActive = (userId: string, isActive: boolean) => {
    toggleUserActiveMutation.mutate({ userId, isActive: !isActive });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Platform Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage all users across organizations
          </p>
        </div>
        <Badge variant="secondary">{total} total</Badge>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Role Dropdown */}
        <Select value={role} onValueChange={(value) => { setRole(value); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="ORG_ADMIN">Org Admin</SelectItem>
            <SelectItem value="AGENT">Agent</SelectItem>
          </SelectContent>
        </Select>

        {/* Organization Dropdown */}
        <Select value={organizationId} onValueChange={(value) => { setOrganizationId(value); setPage(1); }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Organizations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Organizations</SelectItem>
            {organizations.map((org: any) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.organization ? (
                        <Link
                          to={`/admin/organizations/${user.organization.id}`}
                          className="text-primary hover:underline"
                        >
                          {user.organization.name}
                        </Link>
                      ) : (
                        <Badge className="bg-purple-500 hover:bg-purple-600">Platform</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "ORG_ADMIN" ? "default" : user.role === "SUPER_ADMIN" ? "default" : "secondary"}
                        className={
                          user.role === "ORG_ADMIN"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : user.role === "SUPER_ADMIN"
                            ? "bg-purple-600 hover:bg-purple-700"
                            : ""
                        }
                      >
                        {user.role === "ORG_ADMIN" ? "Org Admin" : user.role === "SUPER_ADMIN" ? "Super Admin" : "Agent"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? "default" : "destructive"}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatLastLogin(user.lastLoginAt)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      {user.role !== "SUPER_ADMIN" && (
                        <Button
                          variant={user.isActive ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          disabled={toggleUserActiveMutation.isPending}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1 || isLoading}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
