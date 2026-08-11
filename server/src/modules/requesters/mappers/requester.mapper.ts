import type {
  Requester,
} from "../../../generated/prisma/client.js";
import { buildMeta } from "../../../lib/pagination.js";
import type { PaginatedResponse } from "../../../lib/pagination.js";

export function toRequesterResponse(
  requester: Requester
) {
  return {
    id: requester.id,

    firstName: requester.firstName,

    lastName: requester.lastName,

    email: requester.email,

    phone: requester.phone,

    company: requester.company,

    notes: requester.notes,

    isActive: requester.isActive,

    createdAt: requester.createdAt,

    updatedAt: requester.updatedAt,
  };
}

export function toRequestersResponse(
  requesters: Requester[]
) {
  return requesters.map(
    toRequesterResponse
  );
}

export function toRequestersListResponse({
  items,
  total,
  page,
  pageSize,
}: {
  items: Requester[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedResponse<ReturnType<typeof toRequesterResponse>> {
  return {
    data: items.map(toRequesterResponse),
    meta: buildMeta(total, page, pageSize),
  };
}