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
  query: ListTicketsQuery
) {
  const where: Prisma.TicketWhereInput = {
    organizationId,
  };

  // Apply search filter (title, case-insensitive contains)
  if (query.search) {
    where.title = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  // Apply status filter
  if (query.status !== undefined) {
    where.status = query.status;
  }

  // Apply priorityId filter
  if (query.priorityId !== undefined) {
    where.priorityId = query.priorityId;
  }

  // Apply categoryId filter
  if (query.categoryId !== undefined) {
    where.categoryId = query.categoryId;
  }

  // Apply requesterId filter
  if (query.requesterId !== undefined) {
    where.requesterId = query.requesterId;
  }

  // Apply assignedToId filter (supports "unassigned" literal)
  if (query.assignedToId !== undefined) {
    if (query.assignedToId === "unassigned") {
      where.assignedToId = null;
    } else {
      where.assignedToId = query.assignedToId;
    }
  }

  // Build orderBy
  const orderBy: Prisma.TicketOrderByWithRelationInput = {
    [query.sortBy]: query.sortOrder,
  };

  // Calculate pagination
  const { skip, take } = getSkipTake(query.page, query.pageSize);

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
  organizationId: string
) {
  return prisma.ticket.findFirst({
    where: {
      id,
      organizationId,
    },

    select: ticketSelect,
  });
}

export function createTicket(
  data: Prisma.TicketCreateInput
) {
  return prisma.ticket.create({
    data,

    select: ticketSelect,
  });
}

export function updateTicket(
  id: string,
  data: Prisma.TicketUpdateInput
) {
  return prisma.ticket.update({
    where: {
      id,
    },

    data,

    select: ticketSelect,
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

export function getLastTicketNumber(
  organizationId: string
) {
  return prisma.ticket.findFirst({
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
}