import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Power, PowerOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAdminOrganizations } from "../hooks/useAdminOrganizations";
import { useSuspendOrganization } from "../hooks/useOrganizationActions";
import { useActivateOrganization } from "../hooks/useOrganizationActions";

export default function OrganizationsListPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useAdminOrganizations({ page, pageSize, search });
  const suspendMutation = useSuspendOrganization();
  const activateMutation = useActivateOrganization();

  const organizations = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

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

  const handleSuspend = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to suspend ${name}? This will deactivate all users in the organization.`)) {
      suspendMutation.mutate(id);
    }
  };

  const handleActivate = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to activate ${name}? This will reactivate all users in the organization.`)) {
      activateMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Organizations</h1>
          <p className="text-sm text-muted-foreground">
            Manage all organizations in the platform
          </p>
        </div>
        <Badge variant="secondary">{total} total</Badge>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : organizations.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">No organizations found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((org: any) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{org.name}</div>
                        <div className="text-sm text-muted-foreground">{org.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={org.status === "ACTIVE" ? "default" : "secondary"}>
                        {org.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {org.activeUserCount} / {org.userCount} active
                      </span>
                    </TableCell>
                    <TableCell>{org.ticketCount}</TableCell>
                    <TableCell>{formatDate(org.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/organizations/${org.id}`}>
                            <Eye className="mr-2 size-4" />
                            View
                          </Link>
                        </Button>
                        {org.status === "ACTIVE" ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleSuspend(org.id, org.name)}
                            disabled={suspendMutation.isPending}
                          >
                            <PowerOff className="mr-2 size-4" />
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleActivate(org.id, org.name)}
                            disabled={activateMutation.isPending}
                          >
                            <Power className="mr-2 size-4" />
                            Activate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} organizations
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
