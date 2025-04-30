import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { Deal, Prisma } from '@prismaClient';
import { IDealRepository } from '../interfaces/deal-repository.interface';
import { logError } from '@src/common/utils/logger.utils';

@Injectable()
export class PrismaDealRepository implements IDealRepository {
  private readonly logger = new Logger(PrismaDealRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsert(
    where: Prisma.DealWhereUniqueInput,
    create: Prisma.DealCreateInput,
    update: Prisma.DealUpdateInput,
  ): Promise<Deal | null> {
    const id = where.id;
    try {
      const deal = await this.prisma.deal.upsert({
        where,
        create,
        update,
      });
      this.logger.log(`Upserted deal with Pipedrive ID: ${id}`);
      return deal;
    } catch (error) {
      logError(`Error in Deal upsert for ID ${id}`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(
          `Prisma Error Code: ${error.code}, Meta: ${JSON.stringify(error.meta)}`,
        );
        if (error.code === 'P2003') {
          this.logger.error(
            `Foreign key constraint failed during deal upsert for ID ${id}. Check Person/Org ID existence.`,
          );
        } else if (error.code === 'P2025') {
          this.logger.error(
            `Record not found during deal upsert (potentially related entity issue). ID: ${id}`,
          );
        }
      }
      return null;
    }
  }
}
