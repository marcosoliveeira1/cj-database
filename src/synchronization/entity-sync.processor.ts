import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import {
  ENTITY_SYNC_QUEUE_TOKEN,
  EntitySyncJobName,
  EntitySyncJobPayload,
  ManagedEntityType,
} from '@src/common/utils/queues.types';
import { PipedriveApiService } from '@src/pipedrive-api/pipedrive-api.service';
import { PersonUpsertStrategy } from '@src/webhooks/processing/strategies/person-upsert.strategy';
import { OrganizationUpsertStrategy } from '@src/webhooks/processing/strategies/organization-upsert.strategy';
import { PipelineUpsertStrategy } from '@src/webhooks/processing/strategies/pipeline-upsert.strategy';
import { StageUpsertStrategy } from '@src/webhooks/processing/strategies/stage-upsert.strategy';
import { IUpsertStrategy } from '@src/webhooks/processing/strategies/base-upsert.strategy';
import {
  OrganizationInput,
  PersonInput,
  PipelineInput,
  StageInput,
} from '@src/webhooks/dtos/pipedrive.dto';

type SyncHandler = {
  fetch: (
    id: number,
  ) => Promise<
    PersonInput | OrganizationInput | PipelineInput | StageInput | null
  >;
  upsert: IUpsertStrategy;
};

@Processor(ENTITY_SYNC_QUEUE_TOKEN)
export class EntitySyncProcessor extends WorkerHost {
  private readonly logger = new Logger(EntitySyncProcessor.name);
  private readonly syncHandlers: Record<ManagedEntityType, SyncHandler>;

  constructor(
    private readonly pipedriveApi: PipedriveApiService,
    private readonly personStrategy: PersonUpsertStrategy,
    private readonly orgStrategy: OrganizationUpsertStrategy,
    private readonly pipelineStrategy: PipelineUpsertStrategy,
    private readonly stageStrategy: StageUpsertStrategy,
  ) {
    super();
    this.syncHandlers = {
      person: {
        fetch: (id) => this.pipedriveApi.getPersonById(id),
        upsert: this.personStrategy,
      },
      organization: {
        fetch: (id) => this.pipedriveApi.getOrganizationById(id),
        upsert: this.orgStrategy,
      },
      pipeline: {
        fetch: (id) => this.pipedriveApi.getPipelineById(id),
        upsert: this.pipelineStrategy,
      },
      stage: {
        fetch: (id) => this.pipedriveApi.getStageById(id),
        upsert: this.stageStrategy,
      },
    };
  }

  async process(
    job: Job<EntitySyncJobPayload, any, EntitySyncJobName>,
  ): Promise<void> {
    const { entityType, entityId } = job.data;
    this.logger.log(
      `Starting sync for ${entityType} ID ${entityId}, job ID: ${job.id}`,
    );

    const handler = this.syncHandlers[entityType];
    if (!handler) {
      this.logger.error(`No sync handler found for entity type: ${entityType}`);
      throw new Error(`Invalid entity type for sync: ${entityType}`);
    }

    try {
      const pipedriveData = await handler.fetch(entityId);

      if (!pipedriveData) {
        this.logger.warn(
          `No data found in Pipedrive for ${entityType} ID ${entityId}. The entity may have been deleted. Job will be completed without update.`,
        );
        return;
      }

      await handler.upsert.upsert({
        ...pipedriveData,
        sync_status: 'synced',
      });

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
