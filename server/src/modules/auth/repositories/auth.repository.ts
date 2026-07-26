import { prisma } from "../../../lib/prisma.js";
import type { RegisterDto } from "../dto/register.dto.js";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findOrganizationBySlug(slug: string) {
  return prisma.organization.findUnique({
    where: {
      slug,
    },
  });
}

export async function createOrganization(
  name: string,
  slug: string
) {
  return prisma.organization.create({
    data: {
      name,
      slug,
    },
  });
}

export async function createUser(
  dto: RegisterDto,
  passwordHash: string,
  organizationId: string
) {
  return prisma.user.create({
    data: {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash,
      organizationId,
    },
  });
}