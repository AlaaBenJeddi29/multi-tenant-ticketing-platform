import { AppError } from "../../../lib/AppError.js";

import type {
  CreateSlaDto,
} from "../dto/create-sla.dto.js";

import type {
  UpdateSlaDto,
} from "../dto/update-sla.dto.js";

import {
  createSla,
  deleteSla,
  findSlaById,
  findSlaByPriority,
  findSlas,
  updateSla,
} from "../repositories/sla.repository.js";

import {
  toSlaResponse,
  toSlasResponse,
} from "../mappers/sla.mapper.js";

export async function getSlas(
  organizationId: string
) {
  const slas =
    await findSlas(organizationId);

  return toSlasResponse(slas);
}

export async function getSlaById(
  id: string,
  organizationId: string
) {
  const sla =
    await findSlaById(
      id,
      organizationId
    );

  if (!sla) {
    throw new AppError(
      404,
      "SLA not found."
    );
  }

  return toSlaResponse(sla);
}

export async function createNewSla(
  dto: CreateSlaDto,
  organizationId: string
) {
  const existing =
    await findSlaByPriority(
      dto.priorityId,
      organizationId
    );

  if (existing) {
    throw new AppError(
      409,
      "An SLA already exists for this priority."
    );
  }

  const sla =
    await createSla({
      name: dto.name,

      responseTimeMinutes:
        dto.responseTimeMinutes,

      resolutionTimeMinutes:
        dto.resolutionTimeMinutes,

      isActive:
        dto.isActive ?? true,

      organization: {
        connect: {
          id: organizationId,
        },
      },

      priority: {
        connect: {
          id: dto.priorityId,
        },
      },
    });

  return toSlaResponse(sla);
}

export async function editSla(
  id: string,
  organizationId: string,
  dto: UpdateSlaDto
) {
  await getSlaById(
    id,
    organizationId
  );

  if (dto.priorityId) {
    const existing =
      await findSlaByPriority(
        dto.priorityId,
        organizationId
      );

    if (
      existing &&
      existing.id !== id
    ) {
      throw new AppError(
        409,
        "An SLA already exists for this priority."
      );
    }
  }

  const data: Parameters<
    typeof updateSla
  >[1] = {};

  if (dto.name !== undefined)
    data.name = dto.name;

  if (
    dto.responseTimeMinutes !==
    undefined
  )
    data.responseTimeMinutes =
      dto.responseTimeMinutes;

  if (
    dto.resolutionTimeMinutes !==
    undefined
  )
    data.resolutionTimeMinutes =
      dto.resolutionTimeMinutes;

  if (
    dto.isActive !== undefined
  )
    data.isActive =
      dto.isActive;

  if (
    dto.priorityId !== undefined
  ) {
    data.priority = {
      connect: {
        id: dto.priorityId,
      },
    };
  }

  const sla =
    await updateSla(id, data);

  return toSlaResponse(sla);
}

export async function activateSla(
  id: string,
  organizationId: string
) {
  await getSlaById(
    id,
    organizationId
  );

  const sla =
    await updateSla(id, {
      isActive: true,
    });

  return toSlaResponse(sla);
}

export async function deactivateSla(
  id: string,
  organizationId: string
) {
  await getSlaById(
    id,
    organizationId
  );

  const sla =
    await updateSla(id, {
      isActive: false,
    });

  return toSlaResponse(sla);
}

export async function removeSla(
  id: string,
  organizationId: string
) {
  await getSlaById(
    id,
    organizationId
  );

  await deleteSla(id);
}