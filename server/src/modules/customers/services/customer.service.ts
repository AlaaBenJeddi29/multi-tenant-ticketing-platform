import { AppError } from "../../../lib/AppError.js";

import type {
  CreateCustomerDto,
} from "../dto/create-customer.dto.js";

import type {
  UpdateCustomerDto,
} from "../dto/update-customer.dto.js";

import {
  createCustomer,
  deleteCustomer,
  findCustomerByEmail,
  findCustomerById,
  findCustomers,
  updateCustomer,
} from "../repositories/customer.respoitroy.js";

import {
  toCustomerResponse,
  toCustomersResponse,
} from "../mappers/customer.mapper.js";

export async function getCustomers(
  organizationId: string
) {
  const customers =
    await findCustomers(organizationId);

  return toCustomersResponse(customers);
}

export async function getCustomerById(
  id: string,
  organizationId: string
) {
  const customer =
    await findCustomerById(
      id,
      organizationId
    );

  if (!customer) {
    throw new AppError(
      404,
      "Customer not found."
    );
  }

  return toCustomerResponse(customer);
}

export async function createNewCustomer(
  dto: CreateCustomerDto,
  organizationId: string
) {
  const existing =
    await findCustomerByEmail(
      dto.email,
      organizationId
    );

  if (existing) {
    throw new AppError(
      409,
      "Customer email already exists."
    );
  }

  const customer =
    await createCustomer({
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

  return toCustomerResponse(customer);
}

export async function editCustomer(
  id: string,
  organizationId: string,
  dto: UpdateCustomerDto
) {
  await getCustomerById(
    id,
    organizationId
  );

  const customer =
    await updateCustomer(id, dto);

  return toCustomerResponse(customer);
}

export async function activateCustomer(
  id: string,
  organizationId: string
) {
  await getCustomerById(
    id,
    organizationId
  );

  const customer =
    await updateCustomer(id, {
      isActive: true,
    });

  return toCustomerResponse(customer);
}

export async function deactivateCustomer(
  id: string,
  organizationId: string
) {
  await getCustomerById(
    id,
    organizationId
  );

  const customer =
    await updateCustomer(id, {
      isActive: false,
    });

  return toCustomerResponse(customer);
}

export async function removeCustomer(
  id: string,
  organizationId: string
) {
  await getCustomerById(
    id,
    organizationId
  );

  await deleteCustomer(id);
}