import { Injectable, Inject } from '@nestjs/common';
import { DealMapper } from '@src/deal/deal.mapper';
import { IDealRepository } from '@src/deal/interfaces/deal-repository.interface';
import { BaseUpsertStrategy } from './base-upsert.strategy';
import { Prisma, Deal } from '@prismaClient';
import { DealInput } from '@src/webhooks/dtos/pipedrive.dto';

@Injectable()
export class DealUpsertStrategy extends BaseUpsertStrategy<
  Deal,
  DealInput,
  Prisma.DealCreateInput,
  Prisma.DealUpdateInput,
  Prisma.DealWhereUniqueInput
> {
  constructor(
    @Inject(DealMapper)
    dealMapper: DealMapper,

    @Inject(IDealRepository)
    dealRepository: IDealRepository,
  ) {
    super(dealMapper, dealRepository, 'deal');
  }
}
