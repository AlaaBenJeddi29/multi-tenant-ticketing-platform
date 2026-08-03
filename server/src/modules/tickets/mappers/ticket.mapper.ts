import type {
  Prisma,
} from "../../../generated/prisma/client.js";

/**
 * Matches exactly what ticket.repository.ts returns.
 */
export type TicketWithRelations =
  Prisma.TicketGetPayload<{
    select: {
      id: true;

      ticketNumber: true;

      title: true;

      description: true;

      status: true;

      responseDueAt: true;

      resolutionDueAt: true;

      firstRespondedAt: true;

      resolvedAt: true;

      responseBreached: true;

      resolutionBreached: true;

      createdAt: true;

      updatedAt: true;

      priority: true;

      category: true;

      requester: true;

      asset: true;

      assignedTo: {
        select: {
          id: true;
          firstName: true;
          lastName: true;
          email: true;
          role: true;
        };
      };
    };
  }>;

export function toTicketResponse(
  ticket: TicketWithRelations
) {
  return {
    id: ticket.id,

    ticketNumber:
      ticket.ticketNumber,

    title: ticket.title,

    description:
      ticket.description,

    status: ticket.status,

    priority: ticket.priority,

    category: ticket.category,

    requester: ticket.requester,

    asset: ticket.asset,

    assignedTo:
      ticket.assignedTo,

    responseDueAt:
      ticket.responseDueAt,

    resolutionDueAt:
      ticket.resolutionDueAt,

    firstRespondedAt:
      ticket.firstRespondedAt,

    resolvedAt:
      ticket.resolvedAt,

    responseBreached:
      ticket.responseBreached,

    resolutionBreached:
      ticket.resolutionBreached,

    createdAt:
      ticket.createdAt,

    updatedAt:
      ticket.updatedAt,
  };
}

export function toTicketsResponse(
  tickets: TicketWithRelations[]
) {
  return tickets.map(
    toTicketResponse
  );
}