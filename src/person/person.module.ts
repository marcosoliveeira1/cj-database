import { Module } from '@nestjs/common';
import { PersonMapper } from './person.mapper';
import { PrismaPersonRepository } from './repositories/prisma-person.repository';
import { IPersonRepository } from './interfaces/person-repository.interface';

@Module({
  providers: [
    PersonMapper,
    {
      provide: IPersonRepository,
      useClass: PrismaPersonRepository,
    },
  ],
  exports: [PersonMapper, IPersonRepository],
})
export class PersonModule {}
