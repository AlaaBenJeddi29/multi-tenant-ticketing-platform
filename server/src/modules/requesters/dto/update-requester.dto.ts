import { z } from "zod";
import { createRequesterSchema } from "./create-requester.dto.js";

export const updateRequesterSchema =
  createRequesterSchema.partial();

export type UpdateRequesterDto =
  z.infer<typeof updateRequesterSchema>;