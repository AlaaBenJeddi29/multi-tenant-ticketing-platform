import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCreateComment } from "../hooks/useCreateComment";
import { useDeleteComment } from "../hooks/useDeleteComment";
import { createCommentSchema, type CreateCommentFormData } from "../schemas/comment.schema";

import type { CommentWithAuthor } from "../types/comment.types";

interface CommentThreadProps {
  ticketId: string;
  comments: CommentWithAuthor[];
}

/**
 * CommentThread displays a list of comments and an inline form for adding new comments.
 * Designed to be embedded in TicketDetailPage.
 * 
 * Note: Backend allows any authenticated user to delete any comment.
 * This is a potential security gap - ideally only authors should delete their own comments.
 */
export function CommentThread({ ticketId, comments }: CommentThreadProps) {
  const { user } = useAuth();
  const createMutation = useCreateComment(ticketId);
  const deleteMutation = useDeleteComment(ticketId);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
  });

  const onSubmit = async (data: CreateCommentFormData) => {
    try {
      await createMutation.mutateAsync(data);
      reset(); // Clear form on success
    } catch (error) {
      // Error handling via mutation error state below
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setDeletingId(commentId);
    try {
      await deleteMutation.mutateAsync(commentId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Comments ({comments.length})
        </h3>
        <p className="text-sm text-muted-foreground">
          Conversation history for this ticket
        </p>
      </div>

      <Separator />

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No comments yet. Be the first to add one!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="group relative rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
            >
              {/* Comment Header */}
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {/* Author Avatar */}
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {comment.author.firstName[0]}
                    {comment.author.lastName[0]}
                  </div>

                  {/* Author Name & Timestamp */}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {comment.author.firstName} {comment.author.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleDelete(comment.id)}
                  disabled={deletingId === comment.id}
                  title="Delete comment"
                >
                  {deletingId === comment.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>

              {/* Comment Content */}
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Error Display */}
      {(createMutation.isError || deleteMutation.isError) && (
        <Alert variant="destructive">
          {createMutation.isError && (
            <p>Failed to add comment. Please try again.</p>
          )}
          {deleteMutation.isError && (
            <p>Failed to delete comment. Please try again.</p>
          )}
        </Alert>
      )}

      <Separator />

      {/* Inline Comment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field>
          <FieldLabel htmlFor="content">Add a comment</FieldLabel>
          <div className="flex items-start gap-3">
            {/* Current User Avatar */}
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>

            {/* Textarea */}
            <div className="flex-1 space-y-2">
              <textarea
                id="content"
                rows={3}
                placeholder="Write your comment..."
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("content")}
                disabled={isSubmitting}
              />
              {errors.content && (
                <FieldError>{errors.content.message}</FieldError>
              )}
            </div>
          </div>
        </Field>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Send className="mr-2 size-4" />
                Add Comment
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
