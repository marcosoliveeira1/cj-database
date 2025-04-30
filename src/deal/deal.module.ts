import { Module } from '@nestjs/common';
import { DealMapper } from './deal.mapper';
import { PrismaDealRepository } from './repositories/prisma-deal.repository';
import { IDealRepository } from './interfaces/deal-repository.interface';

@Module({
  providers: [
    DealMapper,
    {
      provide: IDealRepository,
      useClass: PrismaDealRepository,
    },
  ],
  exports: [DealMapper, IDealRepository],
})
export class DealModule {}
