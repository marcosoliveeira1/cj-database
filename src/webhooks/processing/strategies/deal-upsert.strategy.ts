import { Injectable, Inject } from '@nestjs/common';
import { DealMapper } from '@src/deal/deal.mapper';
import { IDealRepository } from '@src/deal/interfaces/deal-repository.interface';
import { BaseUpsertStrategy, PrismaModelResult } from './base-upsert.strategy';
import { Prisma, Deal } from '@prismaClient';
import { DealInput } from '@src/webhooks/dtos/pipedrive.dto';
import { RelatedEntityEnsureService } from '@src/synchronization/related-entity-ensure.service';

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
      this.logger.error(`Cannot upsert ${this.entityType}: Missing Pipedrive ID.`);
      return null;
    }

    try {
      await this.relatedEntityEnsureService.ensureExists('organization', data.org_id);
      await this.relatedEntityEnsureService.ensureExists('person', data.person_id);
    } catch (error) {
      this.logger.error(`Failed to ensure related entities for Deal ID ${pipedriveId}: ${error}`, error.stack);
      throw error;
    }

    return super.upsert(data);
  }
}