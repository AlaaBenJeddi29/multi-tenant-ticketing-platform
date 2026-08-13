import type { PaginatedResponse, PaginationParams } from "@/types/pagination.types";

/**
 * Notification entity from the backend
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
}

/**
 * Query parameters for listing notifications
 */
export interface NotificationListParams extends PaginationParams {
  isRead?: boolean;
}

/**
 * Paginated response for notifications list
 */
export type NotificationsResponse = PaginatedResponse<Notification>;

/**
 * Response for unread count endpoint
 */
export interface UnreadCountResponse {
  count: number;
}
