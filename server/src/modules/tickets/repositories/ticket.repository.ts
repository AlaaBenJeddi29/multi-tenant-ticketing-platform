import { prisma } from "../../../lib/prisma.js";

import type {
  Prisma,
} from "../../../generated/prisma/client.js";

import { getSkipTake } from "../../../lib/pagination.js";
import type { ListTicketsQuery } from "../dto/list-tickets.dto.js";

export const ticketSelect = {
  id: true,

  ticketNumber: true,

  title: true,

  description: true,

  status: true,

  source: true,

  responseDueAt: true,

  resolutionDueAt: true,

  firstRespondedAt: true,

  resolvedAt: true,

  responseBreached: true,

  resolutionBreached: true,

  createdAt: true,

  updatedAt: true,

  priority: true,

  category: true,

  requester: true,

  asset: true,

  assignedTo: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  },

  comments: {
    orderBy: {
      createdAt: "asc",
    },

    select: {
      id: true,

      content: true,

      createdAt: true,

      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  },
} satisfies Prisma.TicketSelect;

export async function findTickets(
  organizationId: string,
  role?: string,
  userId?: string,
  query?: ListTicketsQuery
) {
  const where: Prisma.TicketWhereInput = {
    organizationId,
  };

  // Role-based filtering: AGENT can only see tickets assigned to them
  if (role === "AGENT" && userId) {
    where.assignedToId = userId;
  }

  const actualQuery = query || { page: 1, pageSize: 50, sortBy: "createdAt", sortOrder: "desc" };

  // Apply search filter (title, case-insensitive contains)
  if (actualQuery.search) {
    where.title = {
      contains: actualQuery.search,
      mode: "insensitive",
    };
  }

  // Apply status filter
  if (actualQuery.status !== undefined) {
    where.status = actualQuery.status;
  }

  // Apply priorityId filter
  if (actualQuery.priorityId !== undefined) {
    where.priorityId = actualQuery.priorityId;
  }

  // Apply categoryId filter
  if (actualQuery.categoryId !== undefined) {
    where.categoryId = actualQuery.categoryId;
  }

  // Apply requesterId filter
  if (actualQuery.requesterId !== undefined) {
    where.requesterId = actualQuery.requesterId;
  }

  // Apply assignedToId filter (supports "unassigned" literal)
  // Only for non-AGENT roles
  if (actualQuery.assignedToId !== undefined && role !== "AGENT") {
    if (actualQuery.assignedToId === "unassigned") {
      where.assignedToId = null;
    } else {
      where.assignedToId = actualQuery.assignedToId;
    }
  }

  // Apply source filter
  if (actualQuery.source !== undefined) {
    where.source = actualQuery.source;
  }

  // Build orderBy
  const orderBy: Prisma.TicketOrderByWithRelationInput = {
    [actualQuery.sortBy]: actualQuery.sortOrder,
  };

  // Calculate pagination
  const { skip, take } = getSkipTake(actualQuery.page, actualQuery.pageSize);

  // Execute queries in parallel
  const [items, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy,
      skip,
      take,
      select: ticketSelect,
    }),
    prisma.ticket.count({ where }),
  ]);

  return { items, total };
}

export function findTicketById(
  id: string,
  organizationId: string,
  role?: string,
  userId?: string
) {
  const where: Prisma.TicketWhereInput = {
    id,
    organizationId,
  };

  // Role-based filtering: AGENT can only access tickets assigned to them
  if (role === "AGENT" && userId) {
    where.assignedToId = userId;
  }

  return prisma.ticket.findFirst({
    where,

    select: ticketSelect,
  });
}

/**
 * Allocates the next per-organization ticket number and creates the ticket in
 * a single transaction.
 *
 * A transaction-scoped Postgres advisory lock, keyed by the organization,
 * serializes concurrent allocations for the same tenant so two requests can
 * never read the same maximum and compute the same number. The lock is
 * released automatically when the transaction ends, which makes it safe with
 * connection pooling, and it does not affect other tenants. The
 * (organizationId, ticketNumber) unique index is the final safety net.
 */
export function createTicketWithNextNumber(
  organizationId: string,
  build: (ticketNumber: number) => Prisma.TicketCreateInput
) {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext('ticket_number'), hashtext(${organizationId}))::text AS ok`;

    const last = await tx.ticket.findFirst({
      where: {
        organizationId,
      },

      orderBy: {
        ticketNumber: "desc",
      },

      select: {
        ticketNumber: true,
      },
    });

    const nextTicketNumber = (last?.ticketNumber ?? 0) + 1;

    return tx.ticket.create({
      data: build(nextTicketNumber),

      select: ticketSelect,
    });
  });
}

export function deleteTicket(
  id: string
) {
  return prisma.ticket.delete({
    where: {
      id,
    },

    select: {
      id: true,
    },
  });
}

export function updateTicket(
  id: string,
  data: Prisma.TicketUpdateInput,
  triggeredByAutomation: boolean = false
) {
  return prisma.ticket.update({
    where: {
      id,
    },
    data,
  });
}