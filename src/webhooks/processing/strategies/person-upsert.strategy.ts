import { Injectable, Inject } from '@nestjs/common';
import { PersonMapper } from '@src/person/person.mapper';
import { IPersonRepository } from '@src/person/interfaces/person-repository.interface';
import { BaseUpsertStrategy, PrismaModelResult } from './base-upsert.strategy';
import { Prisma, Person } from '@prismaClient';
import { PersonInput } from '@src/webhooks/dtos/pipedrive.dto';
import { RelatedEntityEnsureService } from '@src/synchronization/related-entity-ensure.service';

@Injectable()
export class PersonUpsertStrategy extends BaseUpsertStrategy<
  Person,
  PersonInput,
  Prisma.PersonCreateInput,
  Prisma.PersonUpdateInput,
  Prisma.PersonWhereUniqueInput
> {
  constructor(
    @Inject(PersonMapper) personMapper: PersonMapper,
    @Inject(IPersonRepository) personRepository: IPersonRepository,
    private readonly relatedEntityEnsureService: RelatedEntityEnsureService,
  ) {
    super(personMapper, personRepository, 'person');
  }

  async upsert(data: PersonInput): Promise<PrismaModelResult | null> {
    const pipedriveId = data.id;
    if (!pipedriveId) {
      this.logger.error(`Cannot upsert ${this.entityType}: Missing Pipedrive ID.`);
      return null;
    }

    try {
      if ('org_id' in data) {
        await this.relatedEntityEnsureService.ensureExists('organization', data.org_id);
      }
    } catch (error) {
      this.logger.error(`Failed to ensure related organization for Person ID ${pipedriveId}: ${error}`, error.stack);
      throw error;
    }

    return super.upsert(data);
  }
}