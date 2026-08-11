import { z } from "zod";

/**
 * Ticket form validation schema
 * Must match backend validation exactly
 */
export const ticketFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must not exceed 150 characters")
    .trim(),

  description: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  priorityId: z
    .string()
    .min(1, "Priority is required")
    .regex(/^[a-z0-9]+$/, "Invalid priority ID"),

  categoryId: z
    .string()
    .min(1, "Category is required")
    .regex(/^[a-z0-9]+$/, "Invalid category ID"),

  requesterId: z
    .string()
    .min(1, "Requester is required")
    .regex(/^[a-z0-9]+$/, "Invalid requester ID"),

  assetId: z
    .string()
    .regex(/^[a-z0-9]+$/, "Invalid asset ID")
    .optional()
    .or(z.literal("")),

  assignedToId: z
    .string()
    .regex(/^[a-z0-9]+$/, "Invalid user ID")
    .optional()
    .or(z.literal("")),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
