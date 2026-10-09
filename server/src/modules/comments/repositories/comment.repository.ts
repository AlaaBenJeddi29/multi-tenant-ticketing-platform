import { prisma } from "../../../lib/prisma.js";

import type {
  Prisma,
} from "../../../generated/prisma/client.js";

import { getSkipTake } from "../../../lib/pagination.js";
import type { ListCommentsQuery } from "../dto/list-comments.dto.js";

const commentSelect = {
  id: true,

  content: true,

  createdAt: true,

  updatedAt: true,

 ticket: {
  select: {
    id: true,
    organizationId: true,
  },
},

author: {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    role: true,
  },
},
} satisfies Prisma.TicketCommentSelect;

export async function findComments(
  ticketId: string,
  query: ListCommentsQuery
) {
  const where: Prisma.TicketCommentWhereInput = {
    ticketId,
  };

  // sortBy and sortOrder are fixed to createdAt asc for comments
  const orderBy: Prisma.TicketCommentOrderByWithRelationInput = {
    createdAt: "asc",
  };

  // Calculate pagination
  const { skip, take } = getSkipTake(query.page, query.pageSize);

  // Execute queries in parallel
  const [items, total] = await Promise.all([
    prisma.ticketComment.findMany({
      where,
      orderBy,
      skip,
      take,
      select: commentSelect,
    }),
    prisma.ticketComment.count({ where }),
  ]);

  return { items, total };
}

export function findCommentById(
  id: string,
  organizationId: string
) {
  return prisma.ticketComment.findFirst({
    where: {
      id,
      ticket: {
        organizationId,
      },
    },

    select: commentSelect,
  });
}

export function createComment(
  data: Prisma.TicketCommentCreateInput
) {
  return prisma.ticketComment.create({
    data,

    select: commentSelect,
  });
}

export function updateComment(
  id: string,
  data: Prisma.TicketCommentUpdateInput
) {
  return prisma.ticketComment.update({
    where: {
      id,
    },

    data,

    select: commentSelect,
  });
}

export function deleteComment(
  id: string
) {
  return prisma.ticketComment.delete({
    where: {
      id,
    },

    select: {
      id: true,
    },
  });
}