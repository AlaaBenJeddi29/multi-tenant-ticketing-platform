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
) {}

export async function getSlaById(
  id: string,
  organizationId: string
) {}

export async function createNewSla(
  dto: CreateSlaDto,
  organizationId: string
) {}

export async function editSla(
  id: string,
  organizationId: string,
  dto: UpdateSlaDto
) {}

export async function activateSla(
  id: string,
  organizationId: string
) {}

export async function deactivateSla(
  id: string,
  organizationId: string
) {}

export async function removeSla(
  id: string,
  organizationId: string
) {}