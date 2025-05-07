import { Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prismaClient';
import { logError } from '@src/common/utils/logger.utils';
import { IRepository } from './interfaces/repository.interface';

export abstract class BasePrismaRepository<
  T extends { id: number },
  W extends { id?: number },
  C,
  U extends object,
  D extends {
    upsert: (args: { where: W; create: C; update: U; select?: any; include?: any }) => Promise<T>;
    findUnique: (args: { where: W; select?: any; include?: any }) => Promise<T | null>;
    create: (args: { data: C; select?: any; include?: any }) => Promise<T>;
  }
> implements IRepository<T, W, C, U> {
  protected readonly logger: Logger;
  protected abstract delegate: D;
  protected abstract entityName: string;

  constructor(protected readonly prisma: PrismaClient) {
    this.logger = new Logger(this.constructor.name);
  }

  async upsert(where: W, create: C, update: U): Promise<T | null> {
    const id = where?.id ?? 'unknown';
    try {
      const updateWithSyncStatus = 'sync_status' in update
        ? { ...update, sync_status: 'synced' }
        : update;

      const result = await this.delegate.upsert({
        where,
        create,
        update: updateWithSyncStatus,
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

  async findById(id: number): Promise<T | null> {
    try {

      const result = await this.delegate.findUnique({
        where: { id } as W,
      });
      return result;
    } catch (error) {
      logError(`Error in ${this.entityName} findById for ID ${id}`, error);
      return null;
    }
  }

  async createPlaceholder({ id }: { id: number }): Promise<T | null> {
    try {

      const placeholderData = {
        id,
        sync_status: 'placeholder',
      } as C;

      const result = await this.delegate.create({
        data: placeholderData,
      });

      this.logger.log(`Created placeholder for ${this.entityName} with ID: ${id}`);
      return result;
    } catch (error) {
      logError(`Error in ${this.entityName} createPlaceholder for ID ${id}`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {

        this.logger.warn(`Placeholder for ${this.entityName} ID ${id} likely already exists due to P2002 error. Attempting to fetch.`);
        return this.findById(id);
      }
      return null;
    }
  }
}