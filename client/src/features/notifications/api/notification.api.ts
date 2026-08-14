import { api } from "@/api/client";
import type {
  Notification,
  NotificationsResponse,
  NotificationListParams,
  UnreadCountResponse,
} from "../types/notification.types";

const BASE_URL = "/notifications";

/**
 * Get paginated list of notifications
 * Scoped server-side by userId
 */
export async function getNotifications(
  params: NotificationListParams
): Promise<NotificationsResponse> {
  const response = await api.get<{ success: boolean; data: NotificationsResponse }>(BASE_URL, { params });
  return response.data.data;
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const response = await api.get<{ success: boolean; data: { unread: number } }>(`${BASE_URL}/unread`);
  return { count: response.data.data.unread };
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(id: string): Promise<Notification> {
  const response = await api.patch<{ success: boolean; data: Notification }>(
    `${BASE_URL}/${id}/read`,
    { isRead: true }
  );
  return response.data.data;
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  await api.patch(`${BASE_URL}/read-all`);
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
}
