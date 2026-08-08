import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title cannot exceed 150 characters."),

  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(1000, "Message cannot exceed 1000 characters."),

  userId: z
    .string()
    .cuid("Invalid user id."),
});

export type CreateNotificationDto =
  z.infer<typeof createNotificationSchema>;