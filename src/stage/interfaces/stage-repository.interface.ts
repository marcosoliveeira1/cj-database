import { Prisma, Stage } from '@prismaClient';
import { IRepository } from '@src/common/respository/interfaces/repository.interface';

export const IStageRepository = Symbol('IStageRepository');

export type IStageRepository = IRepository<
  Stage,
  Prisma.StageWhereUniqueInput,
  Prisma.StageCreateInput,
  Prisma.StageUpdateInput
>;
