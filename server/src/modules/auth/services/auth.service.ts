import bcrypt from "bcrypt";
import type { RegisterDto } from "../dto/register.dto.js";
import { signAccessToken } from "../../../lib/jwt.js";
import { AppError } from "../../../lib/AppError.js"; 
import {
  findUserByEmail,
  findOrganizationBySlug,
  createOrganization,
  createUser,
  updateResetToken,
  findUserByResetToken,
  verifyResetToken,
  clearResetToken,
  findUserByVerifiedResetCode,
  updatePassword,
} from "../repositories/auth.repository.js";
import { LoginDto } from "../dto/login.dto.js";

export async function registerUser(dto: RegisterDto) {
  const existingUser = await findUserByEmail(dto.email);

  if (existingUser) {
    throw new AppError(409, "An account with this email address already exists.");
  }

  const existingOrganization = await findOrganizationBySlug(
    dto.organizationSlug
  );

  if (existingOrganization) {
    throw new AppError(409, "An organization with this slug already exists.");
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const organization = await createOrganization({
    name: dto.organizationName,
    slug: dto.organizationSlug,
  });

  await createUser({
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    passwordHash,
    role: "ORG_ADMIN",

    organization: {
      connect: {
        id: organization.id,
      },
    },
  });

  return {
    message: "User registered successfully.",
  };
}

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function login(data: LoginDto) {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new AppError(401, "Invalid email address or password.");
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new AppError(401, "Invalid email address or password.");
  }

  const token = signAccessToken({
    userId: user.id,
    organizationId: user.organizationId,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    },
  };
}

export async function forgotPassword(email: string) {
  const user = await findUserByEmail(email);

  // Return silently to prevent user enumeration security risks
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

export async function verifyResetCode(code: string) {
  const user = await findUserByResetToken(code);

  if (!user) {
    throw new AppError(400, "Invalid reset code.");
  }

  if (
    !user.resetPasswordExpiresAt ||
    user.resetPasswordExpiresAt < new Date()
  ) {
    throw new AppError(400, "Reset code has expired. Please request a new one.");
  }

  await verifyResetToken(user.id);

  return {
    message: "Reset code verified successfully.",
  };
}

export async function resetPassword(
  code: string,
  password: string
) {
  const user = await findUserByVerifiedResetCode(code);

  if (!user) {
    throw new AppError(400, "Invalid or unverified reset code.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await updatePassword(
    user.id,
    passwordHash
  );

  await clearResetToken(user.id);

  return {
    message: "Password updated successfully.",
  };
}