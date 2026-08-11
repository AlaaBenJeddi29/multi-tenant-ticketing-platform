import { useQuery } from "@tanstack/react-query";
import { getUsers, type UserListParams } from "../api/user.api";

/**
 * Hook to fetch paginated list of users
 * Minimal implementation for tickets assignee dropdown
 * Full users feature will be built in Phase 6
 */
export function useUsersList(params: UserListParams) {
  return useQuery({
    queryKey: ["users", "list", params],
    queryFn: () => getUsers(params),
    placeholderData: (previousData) => previousData,
  });
}
