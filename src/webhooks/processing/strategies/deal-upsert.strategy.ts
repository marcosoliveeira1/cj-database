import { Injectable, Inject } from '@nestjs/common';
import { DealMapper } from '@src/deal/deal.mapper';
import { IDealRepository } from '@src/deal/interfaces/deal-repository.interface';
import { BaseUpsertStrategy, PrismaModelResult } from './base-upsert.strategy';
import { Prisma, Deal } from '@prismaClient';
import { DealInput } from '@src/webhooks/dtos/pipedrive.dto';
import { RelatedEntityEnsureService } from '@src/synchronization/related-entity-ensure.service';
import {
  EntitySyncJobPayload,
  ManagedEntityType,
} from '@src/common/utils/queues.types';

@Injectable()
export class DealUpsertStrategy extends BaseUpsertStrategy<
  Deal,
  DealInput,
  Prisma.DealCreateInput,
  Prisma.DealUpdateInput,
  Prisma.DealWhereUniqueInput
> {
  constructor(
    @Inject(DealMapper) dealMapper: DealMapper,
    @Inject(IDealRepository) dealRepository: IDealRepository,
    private readonly relatedEntityEnsureService: RelatedEntityEnsureService,
  ) {
    super(dealMapper, dealRepository, 'deal');
  }

  async upsert(data: DealInput): Promise<PrismaModelResult | null> {
    const pipedriveId = data.id;
    if (!pipedriveId) {
      this.logger.error(
        `Cannot upsert ${this.entityType}: Missing Pipedrive ID.`,
      );
      return null;
    }

    try {
      const dependencies: EntitySyncJobPayload[] = [
        {
          entityType: 'organization',
          entityId: data.org_id as number,
        },
        {
          entityType: 'person',
          entityId: data.person_id as number,
        },
        {
          entityType: 'pipeline',
          entityId: data.pipeline_id as number,
        },
        {
          entityType: 'stage',
          entityId: data.stage_id as number,
        },
      ];

      await Promise.all(
        dependencies.map(
          ({
            entityType,
            entityId,
          }: {
            entityType: ManagedEntityType;
            entityId: number;
          }) =>
            this.relatedEntityEnsureService.ensureExists(entityType, entityId),
        ),
      );
    } catch (error) {
      this.logger.error(
        `Failed to ensure related entities for Deal ID ${pipedriveId}: ${error}`,
        (error as Error).stack,
      );
      throw error;
    }
    return super.upsert(data);
  }
}
