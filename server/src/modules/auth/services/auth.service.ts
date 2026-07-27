import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { RegisterDto } from "../dto/register.dto.js";


import {
  findUserByEmail,
  findOrganizationBySlug,
  createOrganization,
  createUser,
  updateResetToken,
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

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
  token,
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

export async function forgotPassword(email: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    return;
  }

  const code = generateResetCode();

  const expires = new Date(
    Date.now() + 15 * 60 * 1000
  );

  await updateResetToken(
    user.id,
    code,
    expires
  );

  console.log("================================");
  console.log("PASSWORD RESET CODE");
  console.log(code);
  console.log("================================");
}