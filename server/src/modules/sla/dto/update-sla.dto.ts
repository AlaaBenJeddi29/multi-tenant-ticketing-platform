import { z } from "zod";

import {
  createSlaSchema,
} from "./create-sla.dto.js";

export const updateSlaSchema =
  createSlaSchema.partial();

export type UpdateSlaDto =
  z.infer<typeof updateSlaSchema>;