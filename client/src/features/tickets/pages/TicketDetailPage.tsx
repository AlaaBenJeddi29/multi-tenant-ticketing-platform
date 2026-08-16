import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Tag, Package, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useTicket } from "../hooks/useTicket";
import { useUpdateTicketStatus } from "../hooks/useUpdateTicketStatus";
import { useAssignTicket } from "../hooks/useAssignTicket";
import { useClaimTicket } from "../hooks/useClaimTicket";
import { useUsersList } from "@/features/users/hooks/useUsersList";
import { CommentThread } from "@/features/comments";

import type { TicketStatus } from "../types/ticket.types";

const STATUS_BADGE_VARIANT: Record<
  TicketStatus,
  "default" | "secondary" | "outline"
> = {
  NEW: "default",
  IN_PROGRESS: "secondary",
  WAITING_REQUESTER: "outline",
  RESOLVED: "secondary",
  CLOSED: "outline",
};

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ORG_ADMIN" || user?.role === "SUPER_ADMIN";

  const { data: ticket, isLoading } = useTicket(id!);
  const updateStatusMutation = useUpdateTicketStatus();
  const assignMutation = useAssignTicket();
  const claimMutation = useClaimTicket();

  // Fetch users for assignee dropdown
  const { data: usersData } = useUsersList({
    page: 1,
    pageSize: 100,
    sortBy: "lastName",
    sortOrder: "asc",
    isActive: true,
  });

  const handleStatusChange = (status: TicketStatus) => {
    if (ticket) {
      updateStatusMutation.mutate({ id: ticket.id, input: { status } });
    }
  };

  const handleAssignChange = (assignedToId: string) => {
    if (ticket) {
      assignMutation.mutate({ id: ticket.id, input: { assignedToId } });
    }
  };

  const handleClaimTicket = () => {
    if (ticket) {
      claimMutation.mutate(ticket.id);
    }
  };

  const formatDueDate = (dueDate: string | null, breached: boolean) => {
    if (!dueDate) return null;

    const isOverdue = new Date(dueDate) < new Date();
    const distance = formatDistanceToNow(new Date(dueDate), { addSuffix: true });

    return (
      <div className="flex items-center gap-2">
        <span className={breached || isOverdue ? "text-destructive font-medium" : ""}>
          {distance}
        </span>
        {(breached || isOverdue) && (
          <Badge variant="destructive" className="text-xs">
            {breached ? "Breached" : "Overdue"}
          </Badge>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl p-8">
        <div className="text-center text-muted-foreground">Loading ticket...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto max-w-5xl p-8">
        <div className="text-center text-muted-foreground">Ticket not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/tickets")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Tickets
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{ticket.title}</h1>
              <Badge variant={STATUS_BADGE_VARIANT[ticket.status]}>
                {ticket.status.replace(/_/g, " ")}
              </Badge>
            </div>
            <p className="text-muted-foreground">Ticket #{ticket.ticketNumber}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-foreground whitespace-pre-wrap">
              {ticket.description || "No description provided."}
            </p>
          </div>

          {/* SLA Information */}
          {(ticket.responseDueAt || ticket.resolutionDueAt) && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="size-5" />
                SLA Timelines
              </h2>
              <div className="space-y-3">
                {ticket.responseDueAt && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Response Due
                    </div>
                    <div className="flex items-center justify-between">
                      {formatDueDate(ticket.responseDueAt, ticket.responseBreached)}
                      {ticket.firstRespondedAt && (
                        <Badge variant="secondary" className="text-xs">
                          Responded {formatDistanceToNow(new Date(ticket.firstRespondedAt))} ago
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                {ticket.resolutionDueAt && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Resolution Due
                    </div>
                    <div className="flex items-center justify-between">
                      {formatDueDate(ticket.resolutionDueAt, ticket.resolutionBreached)}
                      {ticket.resolvedAt && (
                        <Badge variant="secondary" className="text-xs">
                          Resolved {formatDistanceToNow(new Date(ticket.resolvedAt))} ago
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Comments Placeholder - Phase 5 */}
          {/* Comments thread mounts here — Phase 5 */}
          <div className="rounded-lg border border-border bg-card p-6">
            <CommentThread ticketId={ticket.id} comments={ticket.comments} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Control */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-semibold mb-3">Status</h3>
            <Select value={ticket.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="WAITING_REQUESTER">Waiting Requester</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignment Control (ORG_ADMIN only) */}
          {isAdmin && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-sm font-semibold mb-3">Assigned To</h3>
              <Select
                value={ticket.assignedTo?.id || "unassigned"}
                onValueChange={handleAssignChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {usersData?.data.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Claim Ticket Button (AGENT only, when unassigned) */}
          {user?.role === "AGENT" && !ticket.assignedTo && (
            <Button
              onClick={handleClaimTicket}
              disabled={claimMutation.isPending}
              className="w-full"
            >
              {claimMutation.isPending ? "Claiming..." : "Claim Ticket"}
            </Button>
          )}

          {/* Ticket Details */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h3 className="text-sm font-semibold">Details</h3>

            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <AlertTriangle className="size-4" />
                Priority
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: ticket.priority.color }}
                />
                <span className="font-medium">{ticket.priority.name}</span>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Tag className="size-4" />
                Category
              </div>
              <span className="font-medium">{ticket.category.name}</span>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <User className="size-4" />
                Requester
              </div>
              <div>
                <div className="font-medium">
                  {ticket.requester.firstName} {ticket.requester.lastName}
                </div>
                <div className="text-sm text-muted-foreground">{ticket.requester.email}</div>
                {ticket.requester.company && (
                  <div className="text-sm text-muted-foreground">{ticket.requester.company}</div>
                )}
              </div>
            </div>

            {ticket.asset && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Package className="size-4" />
                    Asset
                  </div>
                  <div>
                    <div className="font-medium">{ticket.asset.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {ticket.asset.assetTag}
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="size-4" />
                Created
              </div>
              <div className="text-sm">
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="size-4" />
                Updated
              </div>
              <div className="text-sm">
                {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
