import type { PaginatedResponse, PaginationParams } from "@/types/pagination.types";

/**
 * Ticket status enum matching backend
 */
export type TicketStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "WAITING_REQUESTER"
  | "RESOLVED"
  | "CLOSED";

/**
 * Nested user object in assignedTo
 */
export interface TicketAssignee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "AGENT";
}

/**
 * Nested comment author
 */
export interface CommentAuthor {
  id: string;
  firstName: string;
  lastName: string;
}

/**
 * Comment nested in ticket
 */
export interface TicketComment {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
}

/**
 * Priority nested in ticket
 */
export interface TicketPriority {
  id: string;
  name: string;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  color: string;
  responseTime: number;
  resolutionTime: number;
  isActive: boolean;
}

/**
 * Category nested in ticket
 */
export interface TicketCategory {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

/**
 * Requester nested in ticket
 */
export interface TicketRequester {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  isActive: boolean;
}

/**
 * Asset nested in ticket
 */
export interface TicketAsset {
  id: string;
  name: string;
  assetTag: string;
  status: "ACTIVE" | "IN_MAINTENANCE" | "RETIRED";
}

/**
 * Full ticket entity from the backend
 * Exact shape from server/src/modules/tickets/mappers/ticket.mapper.ts
 */
export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  requester: TicketRequester;
  asset: TicketAsset | null;
  assignedTo: TicketAssignee | null;
  comments: TicketComment[];
  responseDueAt: string | null;
  resolutionDueAt: string | null;
  firstRespondedAt: string | null;
  resolvedAt: string | null;
  responseBreached: boolean;
  resolutionBreached: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for creating a new ticket
 */
export interface CreateTicketInput {
  title: string;
  description?: string;
  priorityId: string;
  categoryId: string;
  requesterId: string;
  assetId?: string;
  assignedToId?: string;
}

/**
 * Input for updating an existing ticket
 */
export interface UpdateTicketInput {
  title?: string;
  description?: string | null;
  priorityId?: string;
  categoryId?: string;
  requesterId?: string;
  assetId?: string | null;
  assignedToId?: string | null;
}

/**
 * Input for assigning a ticket
 */
export interface AssignTicketInput {
  assignedToId: string;
}

/**
 * Input for updating ticket status
 */
export interface UpdateTicketStatusInput {
  status: TicketStatus;
}

/**
 * Query parameters for listing tickets
 */
export interface TicketListParams extends PaginationParams {
  search?: string;
  status?: TicketStatus;
  priorityId?: string;
  categoryId?: string;
  assignedToId?: string; // Can be "unassigned" for filtering unassigned tickets
  requesterId?: string;
  sortBy?:
    | "createdAt"
    | "updatedAt"
    | "ticketNumber"
    | "responseDueAt"
    | "resolutionDueAt";
}

/**
 * Paginated response for tickets list
 */
export type TicketsResponse = PaginatedResponse<Ticket>;
