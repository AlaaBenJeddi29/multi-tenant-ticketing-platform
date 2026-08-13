import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../api/notification.api";
import { notificationKeys } from "../api/notification.queryKeys";

/**
 * Hook to fetch unread notification count
 * Automatically refetches every 30 seconds to keep the count live
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadCount,
    refetchInterval: 30_000, // Refetch every 30 seconds
  });
}
