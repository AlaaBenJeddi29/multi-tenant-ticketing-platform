import { AppError } from "../../../lib/AppError.js";

import type {
  CreateRequesterDto,
} from "../dto/create-requester.dto.js";

import type {
  UpdateRequesterDto,
} from "../dto/update-requester.dto.js";

import {
  createRequester,
  deleteRequester,
  findRequesterByEmail,
  findRequesterById,
  findRequesters,
  updateRequester,
} from "../repositories/requester.respoitroy.js";

import {
  toRequesterResponse,
  toRequestersResponse,
} from "../mappers/requester.mapper.js";

export async function getRequesters(
  organizationId: string
) {
  const requesters =
    await findRequesters(organizationId);

  return toRequestersResponse(requesters);
}

export async function getRequesterById(
  id: string,
  organizationId: string
) {
  const requester =
    await findRequesterById(
      id,
      organizationId
    );

  if (!requester) {
    throw new AppError(
      404,
      "Requester not found."
    );
  }

  return toRequesterResponse(requester);
}

export async function createNewRequester(
  dto: CreateRequesterDto,
  organizationId: string
) {
  const existing =
    await findRequesterByEmail(
      dto.email,
      organizationId
    );

  if (existing) {
    throw new AppError(
      409,
      "Requester email already exists."
    );
  }

  const requester =
    await createRequester({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      company: dto.company,
      notes: dto.notes,

      organization: {
        connect: {
          id: organizationId,
        },
      },
    });

  return toRequesterResponse(requester);
}

export async function editRequester(
  id: string,
  organizationId: string,
  dto: UpdateRequesterDto
) {
  await getRequesterById(
    id,
    organizationId
  );

  const requester =
    await updateRequester(id, dto);

  return toRequesterResponse(requester);
}

export async function activateRequester(
  id: string,
  organizationId: string
) {
  await getRequesterById(
    id,
    organizationId
  );

  const requester =
    await updateRequester(id, {
      isActive: true,
    });

  return toRequesterResponse(requester);
}

export async function deactivateRequester(
  id: string,
  organizationId: string
) {
  await getRequesterById(
    id,
    organizationId
  );

  const requester =
    await updateRequester(id, {
      isActive: false,
    });

  return toRequesterResponse(requester);
}

export async function removeRequester(
  id: string,
  organizationId: string
) {
  await getRequesterById(
    id,
    organizationId
  );

  await deleteRequester(id);
}