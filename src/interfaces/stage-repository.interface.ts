import { Prisma, Pipeline } from '@prismaClient';
import { IRepository } from '@src/common/respository/interfaces/repository.interface';

export const IPipelineRepository = Symbol('IPipelineRepository');

export type IPipelineRepository = IRepository<
  Pipeline,
  Prisma.PipelineWhereUniqueInput,
  Prisma.PipelineCreateInput,
  Prisma.PipelineUpdateInput
>;
