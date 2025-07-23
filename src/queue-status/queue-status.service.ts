import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  ENTITY_SYNC_QUEUE_TOKEN,
  WEBHOOK_QUEUE_TOKEN,
} from '@src/common/utils/queues.types';
import { QueueStatusResponseDto } from './dto/queue-status.dto';

@Injectable()
export class QueueStatusService {
  private readonly logger = new Logger(QueueStatusService.name);

  constructor(
    @InjectQueue(WEBHOOK_QUEUE_TOKEN)
    private readonly webhookQueue: Queue,
    @InjectQueue(ENTITY_SYNC_QUEUE_TOKEN)
    private readonly entitySyncQueue: Queue,
  ) {}

  async getQueuesStatus(): Promise<QueueStatusResponseDto[]> {
    this.logger.debug('Fetching job counts for all registered queues.');

    const queues = [this.webhookQueue, this.entitySyncQueue];

    const statuses = await Promise.all(
      queues.map(async (queue) => {
        const counts = await queue.getJobCounts();

        this.logger.debug(`Counts for queue '${queue.name}':`, counts);
        return {
          name: queue.name,
          counts: {
            active: counts.active,
            completed: counts.completed,
            delayed: counts.delayed,
            failed: counts.failed,
            paused: counts.paused,
            prioritized: counts.prioritized,
            waiting: counts.waiting,
            waitingChildren: counts['waiting-children'],
          },
        };
      }),
    );

    this.logger.log('Successfully fetched statuses for all queues.');
    return statuses;
  }
}
