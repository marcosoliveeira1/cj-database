import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('3000').transform(Number),
  DATABASE_URL: z.string().url(),
  CACHE_TTL_SECONDS: z.string().default('3600').transform(Number),
});

export type EnvSchema = z.infer<typeof envSchema>;
