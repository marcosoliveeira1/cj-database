import { Injectable } from '@nestjs/common';
import { BasePrismaRepository } from '@src/common/respository/base-prisma.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { Deal, Prisma } from '@prismaClient';
import { IDealRepository } from '../interfaces/deal-repository.interface';

@Injectable()
export class PrismaDealRepository
  extends BasePrismaRepository<
    Deal,
    Prisma.DealWhereUniqueInput,
    Prisma.DealCreateInput,
    Prisma.DealUpdateInput,
    Prisma.DealDelegate
  >
  implements IDealRepository
{
  protected delegate = this.prisma.deal;
  protected entityName = 'Deal';

  constructor(prisma: PrismaService) {
    super(prisma);
  }
}
