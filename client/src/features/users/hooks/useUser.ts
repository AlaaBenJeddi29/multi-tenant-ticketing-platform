import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/user.api";
import { userKeys } from "../api/user.queryKeys";

/**
 * Hook to fetch a single user by ID
 * ORG_ADMIN only
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}
