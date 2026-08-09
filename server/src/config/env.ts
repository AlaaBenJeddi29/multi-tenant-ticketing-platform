import { z } from "zod";

const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.string(),
  CLIENT_URL: z.string(),
});

export const env = envSchema.parse(process.env);