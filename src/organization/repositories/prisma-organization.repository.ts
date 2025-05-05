import { Injectable } from '@nestjs/common';
import { BasePrismaRepository } from '@src/common/respository/base-prisma.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { Organization, Prisma } from '@prismaClient';
import { IOrganizationRepository } from '../interfaces/organization-repository.interface';

@Injectable()
export class PrismaOrganizationRepository
  extends BasePrismaRepository<
    Organization,
    Prisma.OrganizationWhereUniqueInput,
    Prisma.OrganizationCreateInput,
    Prisma.OrganizationUpdateInput,
    Prisma.OrganizationDelegate
  >
  implements IOrganizationRepository {
  protected delegate = this.prisma.organization;
  protected entityName = 'Organization';

  constructor(prisma: PrismaService) {
    super(prisma);
  }
}