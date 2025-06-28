import { Module } from '@nestjs/common';
import { StageMapper } from './stage.mapper';
import { PrismaStageRepository } from './repositories/prisma-stage.repository';
import { IStageRepository } from './interfaces/stage-repository.interface';

@Module({
  providers: [
    StageMapper,
    {
      provide: IStageRepository,
      useClass: PrismaStageRepository,
    },
  ],
  exports: [StageMapper, IStageRepository],
})
export class StageModule {}
