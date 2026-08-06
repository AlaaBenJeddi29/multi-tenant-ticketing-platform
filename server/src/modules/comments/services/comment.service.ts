import { AppError } from "../../../lib/AppError.js";

import type { CreateCommentDto } from "../dto/create-comment.dto.js";

import type { UpdateCommentDto } from "../dto/update-comment.dto.js";

import {
  createComment,
  deleteComment,
  findCommentById,
  findComments,
  updateComment,
} from "../repositories/comment.repository.js";

import { findTicketById } from "../../tickets/repositories/ticket.repository.js";

import { processFirstResponse } from "../../automation/services/automation-runtime.service.js";

import { executeAutomationRules } from "../../automation/services/automation-engine.service.js";

import {
  toCommentResponse,
  toCommentsResponse,
} from "../mappers/comment.mapper.js";

export async function getComments(
  ticketId: string,
  organizationId: string
) {
  const ticket = await findTicketById(ticketId, organizationId);

  if (!ticket) {
    throw new AppError(404, "Ticket not found.");
  }

  const comments = await findComments(ticketId);

  return toCommentsResponse(comments);
}

export async function createNewComment(
  ticketId: string,
  organizationId: string,
  authorId: string,
  dto: CreateCommentDto
) {
  const ticket = await findTicketById(ticketId, organizationId);

  if (!ticket) {
    throw new AppError(404, "Ticket not found.");
  }

  const comment = await createComment({
    content: dto.content,

    ticket: {
      connect: {
        id: ticketId,
      },
    },

    author: {
      connect: {
        id: authorId,
      },
    },
  });

  await processFirstResponse(
    ticket.id,
    ticket.responseDueAt,
    ticket.firstRespondedAt
  );

  await executeAutomationRules(ticketId, "COMMENT_CREATED");

  return toCommentResponse(comment);
}

export async function editComment(
  id: string,
  userId: string,
  role: string,
  dto: UpdateCommentDto
) {
  const comment = await findCommentById(id);

  if (!comment) {
    throw new AppError(404, "Comment not found.");
  }

  if (role !== "ORG_ADMIN" && comment.author.id !== userId) {
    throw new AppError(403, "You cannot edit this comment.");
  }

  const updated = await updateComment(id, {
    content: dto.content,
  });

  return toCommentResponse(updated);
}

export async function removeComment(
  id: string,
  userId: string,
  role: string
) {
  const comment = await findCommentById(id);

  if (!comment) {
    throw new AppError(404, "Comment not found.");
  }

  if (role !== "ORG_ADMIN" && comment.author.id !== userId) {
    throw new AppError(403, "You cannot delete this comment.");
  }

  await deleteComment(id);
}