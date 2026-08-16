import { api } from "@/api/client";
import type {
  Ticket,
  TicketsResponse,
  TicketListParams,
  CreateTicketInput,
  UpdateTicketInput,
  AssignTicketInput,
  UpdateTicketStatusInput,
} from "../types/ticket.types";

const BASE_URL = "/tickets";

/**
 * Get paginated list of tickets
 */
export async function getTickets(
  params: TicketListParams
): Promise<TicketsResponse> {
  const response = await api.get<TicketsResponse>(BASE_URL, { params });
  return response.data;
}

/**
 * Get a single ticket by ID
 */
export async function getTicketById(id: string): Promise<Ticket> {
  const response = await api.get<Ticket>(`${BASE_URL}/${id}`);
  return response.data;
}

/**
 * Create a new ticket
 * Available to ORG_ADMIN and AGENT
 */
export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const response = await api.post<Ticket>(BASE_URL, input);
  return response.data;
}

/**
 * Update an existing ticket
 * Available to ORG_ADMIN and AGENT
 */
export async function updateTicket(
  id: string,
  input: UpdateTicketInput
): Promise<Ticket> {
  const response = await api.patch<Ticket>(`${BASE_URL}/${id}`, input);
  return response.data;
}

/**
 * Assign a ticket to a user
 * Requires ORG_ADMIN role
 */
export async function assignTicket(
  id: string,
  input: AssignTicketInput
): Promise<Ticket> {
  const response = await api.patch<Ticket>(`${BASE_URL}/${id}/assign`, input);
  return response.data;
}

/**
 * Update ticket status
 * Available to ORG_ADMIN and AGENT
 */
export async function updateTicketStatus(
  id: string,
  input: UpdateTicketStatusInput
): Promise<Ticket> {
  const response = await api.patch<Ticket>(`${BASE_URL}/${id}/status`, input);
  return response.data;
}

/**
 * Delete a ticket
 * Requires ORG_ADMIN role
 */
export async function deleteTicket(id: string): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
}

/**
 * Claim a ticket for the current user
 * Available to ORG_ADMIN and AGENT
 */
export async function claimTicket(id: string): Promise<Ticket> {
  const response = await api.patch<Ticket>(`${BASE_URL}/${id}/claim`);
  return response.data;
}
