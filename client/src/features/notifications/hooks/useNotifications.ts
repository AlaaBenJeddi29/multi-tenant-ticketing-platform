import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/notification.api";
import { notificationKeys } from "../api/notification.queryKeys";
import type { NotificationListParams } from "../types/notification.types";

/**
 * Hook to fetch paginated list of notifications
 * Uses placeholderData to prevent loading flash during pagination
 */
export function useNotifications(params: NotificationListParams) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => getNotifications(params),
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
}
