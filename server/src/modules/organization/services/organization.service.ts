import { AppError } from "../../../lib/AppError.js";

import { toOrganizationResponse } from "../mappers/organization.mapper.js";

import {
  findOrganizationById,
  findOrganizationBySlug,
  updateOrganization,
} from "../repositories/organization.repository.js";

import type { UpdateOrganizationDto } from "../dto/update-organization.dto.js";

export async function getOrganization(
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

export async function editOrganization(
  organizationId: string,
  dto: UpdateOrganizationDto
) {
  if (dto.slug) {
    const existing =
      await findOrganizationBySlug(
        dto.slug
      );

    if (
      existing &&
      existing.id !== organizationId
    ) {
      throw new AppError(
        409,
        "Slug already exists."
      );
    }
  }

  const organization =
    await updateOrganization(
      organizationId,
      dto
    );

  return toOrganizationResponse(
    organization
  );
}