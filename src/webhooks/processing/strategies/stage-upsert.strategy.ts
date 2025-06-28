import { Injectable, Inject } from '@nestjs/common';
import { StageMapper } from '@src/stage/stage.mapper';
import { IStageRepository } from '@src/stage/interfaces/stage-repository.interface';
import { BaseUpsertStrategy, PrismaModelResult } from './base-upsert.strategy';
import { Prisma, Stage } from '@prismaClient';
import { StageInput } from '@src/webhooks/dtos/pipedrive.dto';
import { RelatedEntityEnsureService } from '@src/synchronization/related-entity-ensure.service';

@Injectable()
export class StageUpsertStrategy extends BaseUpsertStrategy<
  Stage,
  StageInput,
  Prisma.StageCreateInput,
  Prisma.StageUpdateInput,
  Prisma.StageWhereUniqueInput
> {
  constructor(
    @Inject(StageMapper) stageMapper: StageMapper,
    @Inject(IStageRepository) stageRepository: IStageRepository,
    private readonly relatedEntityEnsureService: RelatedEntityEnsureService,
  ) {
    super(stageMapper, stageRepository, 'stage');
  }

  async upsert(data: StageInput): Promise<PrismaModelResult | null> {
    const pipedriveId = data.id;
    if (!pipedriveId) {
      this.logger.error(
        `Cannot upsert ${this.entityType}: Missing Pipedrive ID.`,
      );
      return null;
    }

    try {
      await this.relatedEntityEnsureService.ensureExists(
        'pipeline',
        data.pipeline_id,
      );
    } catch (error) {
      this.logger.error(
        `Failed to ensure related pipeline for Stage ID ${pipedriveId}: ${error}`,
        (error as Error).stack,
      );
      throw error;
    }

    return super.upsert(data);
  }
}
