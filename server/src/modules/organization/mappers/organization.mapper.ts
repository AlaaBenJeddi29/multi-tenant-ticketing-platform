import type {
  Organization,
} from "../../../generated/prisma/client.js";

export function toOrganizationResponse(
  organization: Organization
) {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    createdAt: organization.createdAt,
    updatedAt: organization.updatedAt,
  };
}