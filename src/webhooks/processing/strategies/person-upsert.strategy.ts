import { Injectable, Inject } from '@nestjs/common';
import { PersonMapper } from '@src/person/person.mapper';
import { IPersonRepository } from '@src/person/interfaces/person-repository.interface';
import { BaseUpsertStrategy } from './base-upsert.strategy';
import { Prisma, Person } from '@prismaClient';

@Injectable()
export class PersonUpsertStrategy extends BaseUpsertStrategy<
  Person,
  { id: number },
  Prisma.PersonCreateInput,
  Prisma.PersonUpdateInput,
  Prisma.PersonWhereUniqueInput
> {
  constructor(
    @Inject(PersonMapper)
    personMapper: PersonMapper,
    @Inject(IPersonRepository)
    personRepository: IPersonRepository,
  ) {
    super(personMapper, personRepository, 'person');
  }
}
