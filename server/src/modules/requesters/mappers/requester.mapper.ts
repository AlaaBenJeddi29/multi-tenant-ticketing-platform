import type {
  Requester,
} from "../../../generated/prisma/client.js";

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