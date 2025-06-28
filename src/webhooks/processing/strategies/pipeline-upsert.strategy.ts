import { Injectable, Inject } from '@nestjs/common';
import { PipelineMapper } from '@src/pipeline/pipeline.mapper';
import { IPipelineRepository } from '@src/pipeline/interfaces/pipeline-repository.interface';
import { PipelineInput } from '@src/webhooks/dtos/pipedrive.dto';
import { Prisma, Pipeline } from '@prismaClient';
import { BaseUpsertStrategy, PrismaModelResult } from './base-upsert.strategy';

@Injectable()
export class PipelineUpsertStrategy extends BaseUpsertStrategy<
  Pipeline,
  PipelineInput,
  Prisma.PipelineCreateInput,
  Prisma.PipelineUpdateInput,
  Prisma.PipelineWhereUniqueInput
> {
  constructor(
    @Inject(IPipelineRepository)
    repository: IPipelineRepository,
    @Inject(PipelineMapper)
    mapper: PipelineMapper,
  ) {
    super(mapper, repository, 'pipeline');
  }

  async upsert(data: PipelineInput): Promise<PrismaModelResult | null> {
    return super.upsert(data);
  }
}
