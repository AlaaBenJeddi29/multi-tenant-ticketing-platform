import { prisma } from "../../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";

const customerSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  company: true,
  notes: true,
  isActive: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CustomerSelect;

export function findCustomers(
  organizationId: string
) {
  return prisma.customer.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: customerSelect,
  });
}

export function findCustomerById(
  id: string,
  organizationId: string
) {
  return prisma.customer.findFirst({
    where: {
      id,
      organizationId,
    },
    select: customerSelect,
  });
}

export function findCustomerByEmail(
  email: string,
  organizationId: string
) {
  return prisma.customer.findFirst({
    where: {
      email,
      organizationId,
    },
    select: customerSelect,
  });
}

export function createCustomer(
  data: Prisma.CustomerCreateInput
) {
  return prisma.customer.create({
    data,
    select: customerSelect,
  });
}

export function updateCustomer(
  id: string,
  data: Prisma.CustomerUpdateInput
) {
  return prisma.customer.update({
    where: {
      id,
    },
    data,
    select: customerSelect,
  });
}

export function deleteCustomer(
  id: string
) {
  return prisma.customer.delete({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });
}