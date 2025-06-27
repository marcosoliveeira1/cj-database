import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnv } from '@src/config/validate-env';
import { PrismaModule } from '@src/prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhooksModule } from '@src/webhooks/webhooks.module';
import { OrganizationModule } from '@src/organization/organization.module';
import { PersonModule } from '@src/person/person.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { EnvSchema } from '@src/config/env.schema';
import { SynchronizationModule } from '@src/synchronization/synchronization.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PipedriveApiModule } from '@src/pipedrive-api/pipedrive-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvSchema>) => {
        const redisUrlString = configService.get('REDIS_URL', { infer: true });
        if (!redisUrlString) {
          throw new Error(
            'REDIS_URL não está definido nas variáveis de ambiente.',
          );
        }
        const redisUrl = new URL(redisUrlString);
        return {
          connection: {
            host: redisUrl.hostname,
            port: parseInt(redisUrl.port, 10),
          },
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    WebhooksModule,
    OrganizationModule,
    PersonModule,
    SynchronizationModule,
    PipedriveApiModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
