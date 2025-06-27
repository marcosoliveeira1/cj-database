import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import 'tsconfig-paths/register';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from './config/env.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService<EnvSchema>);

  app.enableShutdownHooks();

  const port = configService.get('PORT', { infer: true });
  await app.listen(port as number);
  logger.log(`HTTP Application listening on port ${port}`);
}

void bootstrap();
