import { Module } from '@nestjs/common';
import { PipelineMapper } from './pipeline.mapper';
import { PrismaPipelineRepository } from './repositories/prisma-pipeline.repository';
import { IPipelineRepository } from './interfaces/pipeline-repository.interface';

@Module({
  providers: [
    PipelineMapper,
    {
      provide: IPipelineRepository,
      useClass: PrismaPipelineRepository,
    },
  ],
  exports: [PipelineMapper, IPipelineRepository],
})
export class PipelineModule {}
