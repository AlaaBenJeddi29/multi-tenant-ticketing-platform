import type {
  Prisma,
} from "../../../generated/prisma/client.js";

export type TicketCommentWithAuthor =
  Prisma.TicketCommentGetPayload<{
    select: {
      id: true;

      content: true;

      createdAt: true;

      updatedAt: true;

      author: {
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

export function toCommentResponse(
  comment: TicketCommentWithAuthor
) {
  return {
    id: comment.id,

    content: comment.content,

    author: comment.author,

    createdAt:
      comment.createdAt,

    updatedAt:
      comment.updatedAt,
  };
}

export function toCommentsResponse(
  comments: TicketCommentWithAuthor[]
) {
  return comments.map(
    toCommentResponse
  );
}