import { prisma } from "../../../lib/prisma.js";

import type {
  Prisma,
} from "../../../generated/prisma/client.js";

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

export function findComments(
  ticketId: string
) {
  return prisma.ticketComment.findMany({
    where: {
      ticketId,
    },

    orderBy: {
      createdAt: "asc",
    },

    select: commentSelect,
  });
}

export function findCommentById(
  id: string
) {
  return prisma.ticketComment.findUnique({
    where: {
      id,
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