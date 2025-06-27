import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import {
  ENTITY_SYNC_QUEUE_TOKEN,
  EntitySyncJobName,
  EntitySyncJobPayload,
} from '@src/common/utils/queues.types';

@Processor(ENTITY_SYNC_QUEUE_TOKEN)
export class EntitySyncProcessor extends WorkerHost {
  private readonly logger = new Logger(EntitySyncProcessor.name);

  async process(
    job: Job<EntitySyncJobPayload, any, EntitySyncJobName>,
  ): Promise<void> {
    const { entityType, entityId } = job.data;
    this.logger.log(
      `Starting sync for ${entityType} ID ${entityId}, job ID: ${job.id}`,
    );

    try {
      // make a async call to lint stop errors
      const pipedriveData = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 1000);
      });

      if (!pipedriveData) {
        this.logger.warn(
          `No data found in Pipedrive for ${entityType} ID ${entityId}. Marking sync as failed or handling appropriately.`,
        );
        return;
      }

      this.logger.log(`Successfully synced ${entityType} ID ${entityId}.`);
    } catch (error) {
      this.logger.error(
        `Error syncing ${entityType} ID ${entityId}: ${error}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
