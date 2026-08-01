import { AppError } from "../../../lib/AppError.js";

import {
  findAllOrganizations,
  findOrganizationById,
  findOrganizationBySlug,
  updateOrganization,
} from "../repositories/organization.repository.js";

import {
  toOrganizationResponse,
  toOrganizationsResponse,
} from "../mappers/organization.mapper.js";

import type {
  UpdateOrganizationDto,
} from "../dto/update-organization.dto.js";

export async function getOrganizations() {
  const organizations =
    await findAllOrganizations();

  return toOrganizationsResponse(
    organizations
  );
}

export async function getOrganization(
  id: string
) {
  const organization =
    await findOrganizationById(id);

  if (!organization) {
    throw new AppError(
      404,
      "Organization not found."
    );
  }

  return toOrganizationResponse(
    organization
  );
}

export async function getMyOrganization(
  organizationId: string
) {
  const organization =
    await findOrganizationById(
      organizationId
    );

  if (!organization) {
    throw new AppError(
      404,
      "Organization not found."
    );
  }

  return toOrganizationResponse(
    organization
  );
}

export async function updateOrganizationById(
  id: string,
  dto: UpdateOrganizationDto
) {
  const organization =
    await findOrganizationById(id);

  if (!organization) {
    throw new AppError(
      404,
      "Organization not found."
    );
  }

  let slug = organization.slug;

  if (
    dto.name &&
    dto.name !== organization.name
  ) {
    slug = dto.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    const existing =
      await findOrganizationBySlug(slug);

    if (
      existing &&
      existing.id !== organization.id
    ) {
      throw new AppError(
        409,
        "Organization already exists."
      );
    }
  }

  const updated =
    await updateOrganization(id, {
      name: dto.name,
      slug,
    });

  return toOrganizationResponse(
    updated
  );
}

export async function updateMyOrganization(
  organizationId: string,
  dto: UpdateOrganizationDto
) {
  return updateOrganizationById(
    organizationId,
    dto
  );
}