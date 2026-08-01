import bcrypt from "bcrypt";
import { AppError } from "../../../lib/AppError.js"; 
import type { CreateUserDto } from "../dto/create-user.dto.js";
import type { UpdateUserDto } from "../dto/update-user.dto.js";
import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  findUsersByOrganization,
  updateUser,
} from "../repositories/users.repository.js";

import {
  toUserResponse,
  toUsersResponse,
} from "../mappers/user.mapper.js";

export async function getUsers(
  organizationId: string
) {
  const users =
    await findUsersByOrganization(
      organizationId
    );

  return toUsersResponse(users);
}


export async function getUserById(userId: string, organizationId: string) {
  const user = await findUserById(userId, organizationId);

  if (!user) {
    throw new AppError(404, "User not found or does not belong to your organization.");
  }

  return toUserResponse(user);
}

export async function createNewUser(dto: CreateUserDto, organizationId: string) {
  const existingUser = await findUserByEmail(dto.email);

  if (existingUser) {
    throw new AppError(409, "A user with this email address already exists.");
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);
const user = await createUser({
  firstName: dto.firstName,
  lastName: dto.lastName,
  email: dto.email,
  passwordHash,
  role: dto.role ?? "AGENT",

  organization: {
    connect: {
      id: organizationId,
    },
  },
});

return toUserResponse(user);
}

export async function editUser(
  userId: string,
  organizationId: string,
  dto: UpdateUserDto
) {
  // Ensures user exists and belongs to the caller's tenant
  await getUserById(userId, organizationId);
const user = await updateUser(
  userId,
  dto
);

return toUserResponse(user);
}

export async function activateUser(userId: string, organizationId: string) {
  await getUserById(userId, organizationId);
  
  // Fixed: Uses existing updateUser repository function
const user = await updateUser(
  userId,
  {
    isActive: true,
  }
);

return toUserResponse(user);
}

export async function deactivateUser(userId: string, organizationId: string) {
  await getUserById(userId, organizationId);

  // Fixed: Uses existing updateUser repository function
const user = await updateUser(
  userId,
  {
    isActive: false,
  }
);

return toUserResponse(user);
}

export async function removeUser(
  userId: string,
  organizationId: string
) {
  await getUserById(userId, organizationId);

  await deleteUser(userId);
}