import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrganizationModule } from '@src/organization/organization.module';
import { PersonModule } from '@src/person/person.module';
import { RelatedEntityEnsureService } from './related-entity-ensure.service';
import { ENTITY_SYNC_QUEUE_TOKEN } from '@src/common/utils/queues.types';
import { EntitySyncProcessor } from './entity-sync.processor';
import { ConfigModule } from '@nestjs/config';
import { DEFAULT_JOB_OPTIONS } from '@src/common/utils/queues.config';
import { PipedriveApiModule } from '@src/pipedrive-api/pipedrive-api.module';
import { PersonUpsertStrategy } from '@src/webhooks/processing/strategies/person-upsert.strategy';
import { OrganizationUpsertStrategy } from '@src/webhooks/processing/strategies/organization-upsert.strategy';
import { DealModule } from '@src/deal/deal.module';
import { PipelineModule } from '@src/pipeline/pipeline.module';
import { StageModule } from '@src/stage/stage.module';
import { PipelineUpsertStrategy } from '@src/webhooks/processing/strategies/pipeline-upsert.strategy';
import { StageUpsertStrategy } from '@src/webhooks/processing/strategies/stage-upsert.strategy';
import { UserUpsertStrategy } from '@src/webhooks/processing/strategies/user-upsert.strategy';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [
    OrganizationModule,
    PersonModule,
    ConfigModule,
    PipedriveApiModule,
    DealModule,
    PipelineModule,
    StageModule,
    UserModule,
    BullModule.registerQueueAsync({
      name: ENTITY_SYNC_QUEUE_TOKEN,
      useFactory: () => ({
        defaultJobOptions: DEFAULT_JOB_OPTIONS,
      }),
    }),
  ],
  providers: [
    RelatedEntityEnsureService,
    EntitySyncProcessor,
    PersonUpsertStrategy,
    OrganizationUpsertStrategy,
    PipelineUpsertStrategy,
    StageUpsertStrategy,
    UserUpsertStrategy,
  ],
  exports: [RelatedEntityEnsureService],
})
export class SynchronizationModule {}
