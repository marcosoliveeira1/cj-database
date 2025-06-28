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
import { ConfigModule } from '@nestjs/config';
import { WebhookProcessor } from './processing/webhook.processor';
import { WEBHOOK_QUEUE_TOKEN } from '@src/common/utils/queues.types';
import { SynchronizationModule } from '@src/synchronization/synchronization.module';
import { DEFAULT_JOB_OPTIONS } from '@src/common/utils/queues.config';
import { PipelineModule } from '@src/pipeline/pipeline.module';
import { StageModule } from '@src/stage/stage.module';
import { PipelineUpsertStrategy } from './processing/strategies/pipeline-upsert.strategy';
import { StageUpsertStrategy } from './processing/strategies/stage-upsert.strategy';

@Module({
  imports: [
    AuthModule,
    CustomFieldMappingModule,
    PersonModule,
    OrganizationModule,
    DealModule,
    PipelineModule,
    StageModule,
    ConfigModule,
    SynchronizationModule,
    BullModule.registerQueueAsync({
      name: WEBHOOK_QUEUE_TOKEN,
      useFactory: () => ({
        defaultJobOptions: DEFAULT_JOB_OPTIONS,
      }),
    }),
  ],
  controllers: [WebhooksController],
  providers: [
    WebhookProcessingService,
    PersonUpsertStrategy,
    OrganizationUpsertStrategy,
    DealUpsertStrategy,
    WebhookProcessor,
    PipelineUpsertStrategy,
    StageUpsertStrategy,
  ],
})
export class WebhooksModule {}
