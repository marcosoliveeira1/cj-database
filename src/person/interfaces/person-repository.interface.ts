import { Prisma, Person } from '@prismaClient';
import { IRepository } from '@src/common/respository/interfaces/repository.interface';

export const IPersonRepository = Symbol('IPersonRepository');

export type IPersonRepository = IRepository<
  Person,
  Prisma.PersonWhereUniqueInput,
  Prisma.PersonCreateInput,
  Prisma.PersonUpdateInput
>;
