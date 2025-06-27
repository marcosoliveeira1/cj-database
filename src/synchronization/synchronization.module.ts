import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrganizationModule } from '@src/organization/organization.module';
import { PersonModule } from '@src/person/person.module';
import { RelatedEntityEnsureService } from './related-entity-ensure.service';
import { ENTITY_SYNC_QUEUE_TOKEN } from '@src/common/utils/queues.types';
import { EntitySyncProcessor } from './entity-sync.processor';
import { ConfigModule } from '@nestjs/config';
import { DEFAULT_JOB_OPTIONS } from '@src/common/utils/queues.config';

@Module({
  imports: [
    OrganizationModule,
    PersonModule,
    ConfigModule,
    BullModule.registerQueueAsync({
      name: ENTITY_SYNC_QUEUE_TOKEN,
      useFactory: () => ({
        defaultJobOptions: DEFAULT_JOB_OPTIONS,
      }),
    }),
  ],
  providers: [RelatedEntityEnsureService, EntitySyncProcessor],
  exports: [RelatedEntityEnsureService],
})
export class SynchronizationModule {}
