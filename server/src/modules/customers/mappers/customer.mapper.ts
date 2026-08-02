import type {
  Customer,
} from "../../../generated/prisma/client.js";

export function toCustomerResponse(
  customer: Customer
) {
  return {
    id: customer.id,

    firstName: customer.firstName,

    lastName: customer.lastName,

    email: customer.email,

    phone: customer.phone,

    company: customer.company,

    notes: customer.notes,

    isActive: customer.isActive,

    createdAt: customer.createdAt,

    updatedAt: customer.updatedAt,
  };
}

export function toCustomersResponse(
  customers: Customer[]
) {
  return customers.map(
    toCustomerResponse
  );
}