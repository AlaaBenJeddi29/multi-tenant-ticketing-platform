import type {
  NextFunction,
  Response,
} from "express";

import { requireParam } from "../../../lib/params.js";
import { requireOrganizationId } from "../../../lib/request.js";

import type {
  AuthenticatedRequest,
} from "../../../middleware/auth.middleware.js";

import {
  createCommentSchema,
} from "../dto/create-comment.dto.js";

import {
  updateCommentSchema,
} from "../dto/update-comment.dto.js";

import {
  listCommentsQuerySchema,
} from "../dto/list-comments.dto.js";

import * as commentService
  from "../services/comment.service.js";

export async function getComments(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const query =
      listCommentsQuerySchema.parse(req.query);

    const comments =
      await commentService.getComments(
        requireParam(
          req.params.ticketId,
          "ticketId"
        ),
        requireOrganizationId(req),
        query
      );

    return res.status(200).json(
      comments
    );
  } catch (error) {
    next(error);
  }
}

export async function createComment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      createCommentSchema.parse(
        req.body
      );

    const comment =
      await commentService.createNewComment(
        requireParam(
          req.params.ticketId,
          "ticketId"
        ),
        requireOrganizationId(req),
        req.user!.userId,
        body
      );

    return res
      .status(201)
      .json(comment);
  } catch (error) {
    next(error);
  }
}

export async function updateComment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      updateCommentSchema.parse(
        req.body
      );

    const comment =
      await commentService.editComment(
        requireParam(
          req.params.id,
          "id"
        ),
        requireOrganizationId(req),
        req.user!.userId,
        req.user!.role,
        body
      );

    return res.status(200).json(
      comment
    );
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await commentService.removeComment(
      requireParam(
        req.params.id,
        "id"
      ),
      requireOrganizationId(req),
      req.user!.userId,
      req.user!.role
    );

    return res.status(200).json({
      message:
        "Comment deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}