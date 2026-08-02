import { z } from "zod";
import { createCustomerSchema } from "./create-customer.dto.js";

export const updateCustomerSchema =
  createCustomerSchema.partial();

export type UpdateCustomerDto =
  z.infer<typeof updateCustomerSchema>;