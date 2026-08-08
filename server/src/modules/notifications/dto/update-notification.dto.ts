import { z } from "zod";

export const updateNotificationSchema = z.object({
  isRead: z.boolean(),
});

export type UpdateNotificationDto =
  z.infer<typeof updateNotificationSchema>;