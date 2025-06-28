import { Prisma, User } from '@prismaClient';
import { IRepository } from '@src/common/respository/interfaces/repository.interface';

export const IUserRepository = Symbol('IUserRepository');

export type IUserRepository = IRepository<
  User,
  Prisma.UserWhereUniqueInput,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
>;
