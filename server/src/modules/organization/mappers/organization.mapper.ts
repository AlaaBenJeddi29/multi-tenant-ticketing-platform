import type {
  Organization,
} from "../../../generated/prisma/client.js";

import type {
  OrganizationResponseDto,
} from "../dto/organization-response.dto.js";

export function toOrganizationResponse(
  organization: Organization
): OrganizationResponseDto {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    createdAt: organization.createdAt,
    updatedAt: organization.updatedAt,
  };
}

export function toOrganizationsResponse(
  organizations: Organization[]
): OrganizationResponseDto[] {
  return organizations.map(
    toOrganizationResponse
  );
}