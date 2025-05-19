import "./envConfig";

import z from "zod";

const envSchema = z.object({
  PORT: z.string().optional().default("3000"),
  FRONTEND_ORIGIN: z.string({
    message: "Missing FRONTEND_ORIGIN in environment variables",
  }),
  POSTGRES_HOST: z.string({
    message: "Missing POSTGRES_HOST in environment variables",
  }),
  POSTGRES_PORT: z.string({
    message: "Missing POSTGRES_PORT in environment variables",
  }),
  POSTGRES_USER: z.string({
    message: "Missing POSTGRES_USER in environment variables",
  }),
  POSTGRES_PASSWORD: z.string({
    message: "Missing POSTGRES_PASSWORD in environment variables",
  }),
  POSTGRES_DB: z.string({
    message: "Missing POSTGRES_DB in environment variables",
  }),
});

const env = envSchema.parse(process.env);

export default env;
