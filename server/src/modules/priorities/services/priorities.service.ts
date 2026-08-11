import { AppError } from "../../../lib/AppError.js";

import type {
  CreatePriorityDto,
} from "../dto/create-priority.dto.js";

import type {
  UpdatePriorityDto,
} from "../dto/update-priority.dto.js";

import type {
  ListPrioritiesQuery,
} from "../dto/list-priorities.dto.js";

import {
  createPriority,
  deletePriority,
  findPriorities,
  findPriorityById,
  findPriorityByName,
  updatePriority,
} from "../repositories/priorities.repository.js";

import {
  toPriorityResponse,
  toPrioritiesListResponse,
} from "../mappers/priority.mapper.js";

export async function getPriorities(
  organizationId: string,
  query: ListPrioritiesQuery
) {
  const { items, total } =
    await findPriorities(organizationId, query);

  return toPrioritiesListResponse({
    items,
    total,
    page: query.page,
    pageSize: query.pageSize,
  });
}

export async function getPriorityById(
  priorityId: string,
  organizationId: string
) {
  const priority =
    await findPriorityById(
      priorityId,
      organizationId
    );

  if (!priority) {
    throw new AppError(
      404,
      "Priority not found."
    );
  }

  return toPriorityResponse(priority);
}

export async function createNewPriority(
  dto: CreatePriorityDto,
  organizationId: string
) {
  const existing =
    await findPriorityByName(
      dto.name,
      organizationId
    );

  if (existing) {
    throw new AppError(
      409,
      "A priority with this name already exists."
    );
  }

  const priority =
    await createPriority({
      name: dto.name,
      level: dto.level,
      color: dto.color,

      organization: {
        connect: {
          id: organizationId,
        },
      },
    });

  return toPriorityResponse(priority);
}

export async function editPriority(
  priorityId: string,
  organizationId: string,
  dto: UpdatePriorityDto
) {
  await getPriorityById(
    priorityId,
    organizationId
  );

  if (dto.name) {
    const existing =
      await findPriorityByName(
        dto.name,
        organizationId
      );

    if (
      existing &&
      existing.id !== priorityId
    ) {
      throw new AppError(
        409,
        "Priority name already exists."
      );
    }
  }

  const priority =
    await updatePriority(
      priorityId,
      dto
    );

  return toPriorityResponse(priority);
}

export async function activatePriority(
  priorityId: string,
  organizationId: string
) {
  await getPriorityById(
    priorityId,
    organizationId
  );

  const priority =
    await updatePriority(
      priorityId,
      {
        isActive: true,
      }
    );

  return toPriorityResponse(priority);
}

export async function deactivatePriority(
  priorityId: string,
  organizationId: string
) {
  await getPriorityById(
    priorityId,
    organizationId
  );

  const priority =
    await updatePriority(
      priorityId,
      {
        isActive: false,
      }
    );

  return toPriorityResponse(priority);
}

export async function removePriority(
  priorityId: string,
  organizationId: string
) {
  await getPriorityById(
    priorityId,
    organizationId
  );

  await deletePriority(priorityId);
}