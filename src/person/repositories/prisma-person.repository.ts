import { Injectable } from '@nestjs/common';
import { BasePrismaRepository } from '@src/common/respository/base-prisma.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { Person, Prisma } from '@prismaClient';
import { IPersonRepository } from '../interfaces/person-repository.interface';

@Injectable()
export class PrismaPersonRepository
  extends BasePrismaRepository<
    Person,
    Prisma.PersonWhereUniqueInput,
    Prisma.PersonCreateInput,
    Prisma.PersonUpdateInput,
    Prisma.PersonDelegate
  >
  implements IPersonRepository {
  protected delegate = this.prisma.person;
  protected entityName = 'Person';

  constructor(prisma: PrismaService) {
    super(prisma);
  }
}