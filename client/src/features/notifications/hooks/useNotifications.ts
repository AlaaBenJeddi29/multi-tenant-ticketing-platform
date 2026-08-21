import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/notification.api";
import { notificationKeys } from "../api/notification.queryKeys";
import type { NotificationListParams } from "../types/notification.types";

/**
 * Hook to fetch paginated list of notifications
 * Uses placeholderData to prevent loading flash during pagination
 * Polls every 30 seconds to show new notifications without page refresh
 * Refetches on window focus to show updates when user returns to tab
 */
export function useNotifications(params: NotificationListParams) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => getNotifications(params),
    placeholderData: (previousData) => previousData, // Keep previous data while loading
    refetchInterval: 30000, // Poll every 30 seconds
    refetchOnWindowFocus: true, // Refresh when user returns to tab
  });
}
