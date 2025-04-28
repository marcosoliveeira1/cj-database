import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { Person, Prisma } from '@prismaClient';
import { IPersonRepository } from '../interfaces/person-repository.interface'; //
import { logError } from '@src/common/utils/logger.utils';

@Injectable()
export class PrismaPersonRepository implements IPersonRepository {
  private readonly logger = new Logger(PrismaPersonRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsert(
    where: Prisma.PersonWhereUniqueInput,
    create: Prisma.PersonCreateInput,
    update: Prisma.PersonUpdateInput,
  ): Promise<Person | null> {
    const id = where.id;
    try {
      const person = await this.prisma.person.upsert({
        where,
        create,
        update,
      });
      this.logger.log(`Upserted person with Pipedrive ID: ${id}`);
      return person;
    } catch (error) {
      logError(`Error in Person upsert for ID ${id}`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(
          `Prisma Error Code: ${error.code}, Meta: ${JSON.stringify(error.meta)}`,
        );
        if (error.code === 'P2025') {
          this.logger.error(
            `Related record (e.g., Organization) not found during person upsert. ID: ${id}`,
          );
        }
      }
      return null;
    }
  }
}
