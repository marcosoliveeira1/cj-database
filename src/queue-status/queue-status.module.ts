import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from '@src/auth/auth.module';
import { QueueStatusController } from './queue-status.controller';
import { QueueStatusService } from './queue-status.service';
import {
  ENTITY_SYNC_QUEUE_TOKEN,
  WEBHOOK_QUEUE_TOKEN,
} from '@src/common/utils/queues.types';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue(
      { name: WEBHOOK_QUEUE_TOKEN },
      { name: ENTITY_SYNC_QUEUE_TOKEN },
    ),
  ],
  controllers: [QueueStatusController],
  providers: [QueueStatusService],
})
export class QueueStatusModule {}
