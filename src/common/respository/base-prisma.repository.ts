import { Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prismaClient';
import { logError } from '@src/common/utils/logger.utils';
import { IRepository } from './interfaces/repository.interface';


export abstract class BasePrismaRepository<T, W, C, U, D>
  implements IRepository<T, W, C, U> {
  protected readonly logger: Logger;
  protected abstract delegate: D & {
    upsert: (args: { where: W; create: C; update: U }) => Promise<T>;
  };
  protected abstract entityName: string;

  constructor(protected readonly prisma: PrismaClient) {
    this.logger = new Logger(this.constructor.name);
  }

  async upsert(where: W, create: C, update: U): Promise<T | null> {
    const id = (where as WhereInput)?.id ?? 'unknown';
    try {
      const result = await this.delegate.upsert({
        where,
        create,
        update,
      });
      this.logger.log(`Upserted ${this.entityName} with ID: ${id}`);
      return result;
    } catch (error) {
      logError(`Error in ${this.entityName} upsert for ID ${id}`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(
          `Prisma Error Code: ${error.code}, Meta: ${JSON.stringify(error.meta)}`,
        );
        if (error.code === 'P2003') {
          this.logger.error(
            `Foreign key constraint failed during ${this.entityName} upsert for ID ${id}.`,
          );
        } else if (error.code === 'P2025') {
          this.logger.error(
            `Record not found during ${this.entityName} upsert. ID: ${id}`,
          );
        }
      }
      return null;
    }
  }
}

type WhereInput = {
  id: number;
};
