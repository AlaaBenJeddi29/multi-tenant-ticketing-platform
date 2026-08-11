import type { User } from "../../../generated/prisma/client.js";
import { buildMeta } from "../../../lib/pagination.js";
import type { PaginatedResponse } from "../../../lib/pagination.js";

export function toUserResponse(user: User) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toUsersResponse(users: User[]) {
  return users.map(toUserResponse);
}

export function toUsersListResponse({
  items,
  total,
  page,
  pageSize,
}: {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedResponse<ReturnType<typeof toUserResponse>> {
  return {
    data: items.map(toUserResponse),
    meta: buildMeta(total, page, pageSize),
  };
}