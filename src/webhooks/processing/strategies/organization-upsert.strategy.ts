import { Injectable, Inject } from '@nestjs/common';
import { OrganizationMapper } from '@src/organization/organization.mapper';
import { IOrganizationRepository } from '@src/organization/interfaces/organization-repository.interface';
import { OrganizationInput } from '@src/webhooks/dtos/pipedrive.dto';
import { Prisma, Organization } from '@prismaClient';
import { BaseUpsertStrategy } from './base-upsert.strategy';

@Injectable()
export class OrganizationUpsertStrategy extends BaseUpsertStrategy<
  Organization,
  OrganizationInput,
  Prisma.OrganizationCreateInput,
  Prisma.OrganizationUpdateInput,
  Prisma.OrganizationWhereUniqueInput
> {
  constructor(
    @Inject(IOrganizationRepository)
    orgRepository: IOrganizationRepository,
    @Inject(OrganizationMapper)
    mapper: OrganizationMapper,
  ) {
    super(mapper, orgRepository, 'organization');
  }
}
