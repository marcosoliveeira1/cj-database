import { Prisma, Deal } from '@prismaClient';
import { IRepository } from '@src/common/respository/interfaces/repository.interface';

export const IDealRepository = Symbol('IDealRepository');

export type IDealRepository = IRepository<
  Deal,
  Prisma.DealWhereUniqueInput,
  Prisma.DealCreateInput,
  Prisma.DealUpdateInput
>;
