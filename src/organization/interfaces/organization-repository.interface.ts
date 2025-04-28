import { Prisma, Organization } from '@prismaClient';
import { IRepository } from '@src/common/respository/interfaces/repository.interface';

export const IOrganizationRepository = Symbol('IOrganizationRepository');

export type IOrganizationRepository = IRepository<
  Organization,
  Prisma.OrganizationWhereUniqueInput,
  Prisma.OrganizationCreateInput,
  Prisma.OrganizationUpdateInput
>;
