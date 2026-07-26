import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { RegisterDto } from "../dto/register.dto.js";


import {
  findUserByEmail,
  findOrganizationBySlug,
  createOrganization,
  createUser,
} from "../repositories/auth.repository.js";
import { LoginDto } from "../dto/login.dto.js";

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
export async function login(data: LoginDto) {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      sub: user.id,
      tenantId: user.organizationId,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  return {
    accessToken: token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      tenantId: user.organizationId,
    },
  };
}