import { Injectable } from '@nestjs/common';
import { BasePrismaRepository } from '@src/common/respository/base-prisma.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { Stage, Prisma } from '@prismaClient';
import { IStageRepository } from '../interfaces/stage-repository.interface';

@Injectable()
export class PrismaStageRepository
  extends BasePrismaRepository<
    Stage,
    Prisma.StageWhereUniqueInput,
    Prisma.StageCreateInput,
    Prisma.StageUpdateInput,
    Prisma.StageDelegate
  >
  implements IStageRepository
{
  protected delegate = this.prisma.stage;
  protected entityName = 'Stage';

  constructor(prisma: PrismaService) {
    super(prisma);
  }
}
