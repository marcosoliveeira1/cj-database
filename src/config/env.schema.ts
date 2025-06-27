import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  CACHE_TTL_SECONDS: z.coerce.number().default(3600),
  PIPEDRIVE_WEBHOOK_USER: z.string().min(1),
  PIPEDRIVE_WEBHOOK_PASSWORD: z.string().min(1),
  PIPEDRIVE_API_TOKEN: z.string().min(1),
  PIPEDRIVE_API_URL: z.string().url().default('https://api.pipedrive.com/v1'),

  REDIS_URL: z.string().url(),
});

export type EnvSchema = z.infer<typeof envSchema>;
