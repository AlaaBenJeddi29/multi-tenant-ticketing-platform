import type { NotificationListParams } from "../types/notification.types";

/**
 * Hierarchical query keys for notifications
 * 
 * Structure:
 * - notificationKeys.all: Invalidates everything
 * - notificationKeys.lists(): Invalidates all lists
 * - notificationKeys.list(params): Specific list with filters
 * - notificationKeys.unreadCount: Unread count query
 */
export const notificationKeys = {
  all: ["notifications"] as const,
  
  lists: () => [...notificationKeys.all, "list"] as const,
  
  list: (params: NotificationListParams) =>
    [...notificationKeys.lists(), params] as const,
  
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};
