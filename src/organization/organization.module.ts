import { Module } from '@nestjs/common';
import { OrganizationMapper } from './organization.mapper';
import { PrismaOrganizationRepository } from './repositories/prisma-organization.repository';
import { IOrganizationRepository } from './interfaces/organization-repository.interface';

@Module({
  providers: [
    OrganizationMapper,
    {
      provide: IOrganizationRepository,
      useClass: PrismaOrganizationRepository,
    },
  ],
  exports: [OrganizationMapper, IOrganizationRepository],
})
export class OrganizationModule {}
