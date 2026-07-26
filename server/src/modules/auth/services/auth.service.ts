import bcrypt from "bcrypt";

import type { RegisterDto } from "../dto/register.dto.js";

import {
  findUserByEmail,
  findOrganizationBySlug,
  createOrganization,
  createUser,
} from "../repositories/auth.repository.js";

export async function registerUser(dto: RegisterDto) {
  const existingUser = await findUserByEmail(dto.email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const existingOrganization = await findOrganizationBySlug(
    dto.organizationSlug
  );

  if (existingOrganization) {
    throw new Error("Organization slug already exists");
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const organization = await createOrganization(
    dto.organizationName,
    dto.organizationSlug
  );

  await createUser(dto, passwordHash, organization.id);

  return {
    message: "User registered successfully",
  };
}