import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { AuthModule } from '@src/auth/auth.module';
import { WebhookProcessingService } from './processing/webhook-processing.service';
import { PersonUpsertStrategy } from './processing/strategies/person-upsert.strategy';
import { OrganizationUpsertStrategy } from './processing/strategies/organization-upsert.strategy';
import { CustomFieldMappingModule } from './custom-fields/custom-field-mapping.module';
import { PersonModule } from '@src/person/person.module';
import { OrganizationModule } from '@src/organization/organization.module';
import { DealModule } from '@src/deal/deal.module';
import { DealUpsertStrategy } from './processing/strategies/deal-upsert.strategy';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvSchema } from '@src/config/env.schema';
import { WebhookProcessor } from './processing/webhook.processor';
import { WEBHOOK_QUEUE_TOKEN } from './webhook.constants';

@Module({
  imports: [
    AuthModule,
    CustomFieldMappingModule,
    PersonModule,
    OrganizationModule,
    DealModule,
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<EnvSchema>) => {
        const redisUrlString = configService.get('REDIS_URL', { infer: true });
        if (!redisUrlString) {
          throw new Error('REDIS_URL não está definido nas variáveis de ambiente.');
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
    BullModule.registerQueueAsync({
      name: WEBHOOK_QUEUE_TOKEN,
      imports: [ConfigModule],
      useFactory: async () => ({
        name: WEBHOOK_QUEUE_TOKEN,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      }),
      inject: [],
    }),
  ],
  controllers: [WebhooksController],
  providers: [
    WebhookProcessingService,
    PersonUpsertStrategy,
    OrganizationUpsertStrategy,
    DealUpsertStrategy,
    WebhookProcessor,
  ],
})

export class WebhooksModule { }