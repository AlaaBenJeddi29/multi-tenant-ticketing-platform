import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Ticket, AlertTriangle, Power, PowerOff, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAdminOrganization } from "../hooks/useAdminOrganization";
import { useSuspendOrganization } from "../hooks/useOrganizationActions";
import { useActivateOrganization } from "../hooks/useOrganizationActions";

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: organization, isLoading } = useAdminOrganization(id || "");
  const suspendMutation = useSuspendOrganization();
  const activateMutation = useActivateOrganization();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSuspend = () => {
    if (!id || !organization) return;
    if (window.confirm(`Are you sure you want to suspend ${organization.name}? This will deactivate all users in the organization.`)) {
      suspendMutation.mutate(id);
    }
  };

  const handleActivate = () => {
    if (!id || !organization) return;
    if (window.confirm(`Are you sure you want to activate ${organization.name}? This will reactivate all users in the organization.`)) {
      activateMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Organization not found</p>
      </div>
    );
  }

  const isActive = organization.activeUserCount > 0;

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link to="/admin/organizations">
          <ArrowLeft className="mr-2 size-4" />
          Back to Organizations
        </Link>
      </Button>

      {/* Section 1 - Organization Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{organization.name}</h1>
              <p className="text-sm text-muted-foreground">{organization.slug}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Created {formatDate(organization.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "ACTIVE" : "INACTIVE"}
              </Badge>
              {isActive ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleSuspend}
                  disabled={suspendMutation.isPending}
                >
                  <PowerOff className="mr-2 size-4" />
                  Suspend
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleActivate}
                  disabled={activateMutation.isPending}
                >
                  <Power className="mr-2 size-4" />
                  Activate
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Section 2 - Stats Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="size-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{organization.userCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="size-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{organization.activeUserCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Ticket className="size-4" />
              Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{organization.openTickets}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="size-4" />
              SLA Breaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{organization.slaBreaches}</p>
          </CardContent>
        </Card>
      </div>

      {/* Section 3 - Two Columns */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {organization.recentTickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tickets found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organization.recentTickets.map((ticket: any) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ticket.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Users */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            {organization.users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organization.users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDateTime(user.lastLoginAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {}}
                          title="User management coming soon"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
