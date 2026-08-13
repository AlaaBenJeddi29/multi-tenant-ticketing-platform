import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/user.api";
import { userKeys } from "../api/user.queryKeys";
import type { UserListParams } from "../types/user.types";

/**
 * Hook to fetch paginated list of users
 * Uses placeholderData to prevent loading flash during pagination
 * ORG_ADMIN only
 */
export function useUsersList(params: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: (previousData) => previousData,
  });
}
