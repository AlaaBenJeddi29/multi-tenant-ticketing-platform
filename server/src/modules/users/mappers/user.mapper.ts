import type { User } from "../../../generated/prisma/client.js";

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