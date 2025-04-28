import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { Organization, Prisma } from '@prismaClient';
import { logError } from '@src/common/utils/logger.utils';
import { IRepository } from '@src/common/respository/interfaces/repository.interface';

@Injectable()
export class PrismaOrganizationRepository
  implements
    IRepository<
      Organization,
      { id: number },
      Prisma.OrganizationCreateInput,
      Prisma.OrganizationUpdateInput
    >
{
  private readonly logger = new Logger(PrismaOrganizationRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsert(
    where: Prisma.OrganizationWhereUniqueInput,
    create: Prisma.OrganizationCreateInput,
    update: Prisma.OrganizationUpdateInput,
  ): Promise<Organization | null> {
    const id = where.id;
    try {
      const organization = await this.prisma.organization.upsert({
        where,
        create,
        update,
      });
      this.logger.log(`Upserted organization with Pipedrive ID: ${id}`);
      return organization;
    } catch (error) {
      logError(`Error in Organization upsert for ID ${id}`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(
          `Prisma Error Code: ${error.code}, Meta: ${JSON.stringify(error.meta)}`,
        );
      }
      return null;
    }
  }
}
