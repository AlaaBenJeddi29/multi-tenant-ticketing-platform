import type { UserListParams } from "../types/user.types";

/**
 * Hierarchical query keys for users
 * 
 * Structure:
 * - userKeys.all: Invalidates everything
 * - userKeys.lists(): Invalidates all lists
 * - userKeys.list(params): Specific list with filters
 * - userKeys.details(): Invalidates all details
 * - userKeys.detail(id): Specific user detail
 */
export const userKeys = {
  all: ["users"] as const,
  
  lists: () => [...userKeys.all, "list"] as const,
  
  list: (params: UserListParams) =>
    [...userKeys.lists(), params] as const,
  
  details: () => [...userKeys.all, "detail"] as const,
  
  detail: (id: string) => [...userKeys.details(), id] as const,
};
