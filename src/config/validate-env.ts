import { envSchema } from './env.schema';

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error(
      '❌ Invalid environment variables:',
      JSON.stringify(result.error.format(), null, 2), // Pretty print Zod errors
    );
    process.exit(1);
  }

  return result.data;
}
