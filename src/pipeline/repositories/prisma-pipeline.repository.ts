import { Injectable } from '@nestjs/common';
import { BasePrismaRepository } from '@src/common/respository/base-prisma.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { Pipeline, Prisma } from '@prismaClient';
import { IPipelineRepository } from '../interfaces/pipeline-repository.interface';

@Injectable()
export class PrismaPipelineRepository
  extends BasePrismaRepository<
    Pipeline,
    Prisma.PipelineWhereUniqueInput,
    Prisma.PipelineCreateInput,
    Prisma.PipelineUpdateInput,
    Prisma.PipelineDelegate
  >
  implements IPipelineRepository
{
  protected delegate = this.prisma.pipeline;
  protected entityName = 'Pipeline';

  constructor(prisma: PrismaService) {
    super(prisma);
  }
}
