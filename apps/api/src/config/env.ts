import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string(),
  NESSIE_API_BASE: z.string().default('https://api.reimaginebanking.com'),
  NESSIE_API_KEY: z.string().optional(),
  CLIMATIQ_API_BASE: z.string().default('https://api.climatiq.io'),
  CLIMATIQ_API_KEY: z.string().optional(),
  USE_LOCAL_EMISSION_DATA: z.string().transform((v) => v === 'true').default('true'),
  JWT_SECRET: z.string().default('dev-secret-change-in-production'),
});

export const env = envSchema.parse(process.env);

