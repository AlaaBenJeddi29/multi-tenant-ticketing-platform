import { z } from "zod";
import { paginationQuerySchema } from "../../../lib/pagination.js";

// Notifications have pagination, isRead filter, and sortBy fixed to createdAt descending
export const listNotificationsQuerySchema = paginationQuerySchema
  .omit({ sortOrder: true })
  .extend({
    isRead: z.coerce
      .boolean()
      .optional(),

    // sortBy and sortOrder are fixed for notifications (newest first)
    sortBy: z.literal("createdAt").default("createdAt"),
    sortOrder: z.literal("desc").default("desc"),
  });

export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>;
