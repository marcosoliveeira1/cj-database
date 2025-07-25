import { Logger, Injectable } from '@nestjs/common';
import { logError } from '@src/common/utils/logger.utils';
import { IMapper } from '@src/common/mapping/interfaces/mapper.interface';
import { IRepository } from '@src/common/respository/interfaces/repository.interface';
import {
  Person,
  Organization,
  Deal,
  Pipeline,
  Stage,
  User,
} from '@prismaClient';

export type PrismaModelResult =
  | (Person & { entityType: 'person' })
  | (Organization & { entityType: 'organization' })
  | (Deal & { entityType: 'deal' })
  | (Pipeline & { entityType: 'pipeline' })
  | (Stage & { entityType: 'stage' })
  | (User & { entityType: 'user' });

export type PipedriveData = {
  id: number;
  custom_fields?: Record<string, any> | null;
  add_time?: string | null;
  update_time?: string | null;
  sync_status?: string;
  [key: string]: any;
};

export interface IUpsertStrategy {
  upsert(data: PipedriveData): Promise<PrismaModelResult | null>;
}

@Injectable()
export class BaseUpsertStrategy<
  Entity extends { id: number; pipedriveUpdateTime?: Date | null },
  InputDto extends PipedriveData,
  CreateInput,
  UpdateInput,
  WhereInput extends { id?: number },
> implements IUpsertStrategy
{
  protected readonly logger: Logger;

  constructor(
    protected readonly mapper: IMapper<InputDto, CreateInput, UpdateInput>,
    protected readonly repository: IRepository<
      Entity,
      WhereInput,
      CreateInput,
      UpdateInput
    >,
    protected readonly entityType:
      | 'person'
      | 'organization'
      | 'deal'
      | 'pipeline'
      | 'stage'
      | 'user',
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async upsert(data: InputDto): Promise<PrismaModelResult | null> {
    const pipedriveId = data.id;
    if (!pipedriveId) {
      this.logger.error(
        `Cannot upsert ${this.entityType}: Missing Pipedrive ID.`,
      );
      return null;
    }

    const incomingUpdateTime = new Date(data.update_time ?? '');
    const existingEntity = await this.repository.findById(pipedriveId);

    // To prevent out-of-order webhook processing, we compare the `update_time` of the incoming
    // payload with the `pipedriveUpdateTime` stored in our database. If the incoming update
    // is older than or the same as the existing record, we skip the upsert. This simple
    // yet effective strategy ensures that we don't overwrite newer data with stale information.
    if (
      data?.update_time &&
      existingEntity &&
      existingEntity.pipedriveUpdateTime
    ) {
      if (incomingUpdateTime <= existingEntity.pipedriveUpdateTime) {
        this.logger.log(
          `Skipping stale webhook for ${this.entityType} ID ${pipedriveId}. Incoming update time (${incomingUpdateTime.toISOString()}) is older than or equal to existing one (${existingEntity.pipedriveUpdateTime.toISOString()}).`,
        );
        return {
          ...existingEntity,
          entityType: this.entityType,
        } as unknown as PrismaModelResult;
      }
    }

    this.logger.log(
      `Mapping and upserting ${this.entityType} with Pipedrive ID: ${pipedriveId}`,
    );

    try {
      const createInput = await this.mapper.toCreateInput(data);
      const updateInput = await this.mapper.toUpdateInput(data);

      const whereInput = { id: pipedriveId } as WhereInput;

      const result: Entity | null = await this.repository.upsert(
        whereInput,
        createInput,
        updateInput,
      );

      if (!result) {
        this.logger.warn(
          `${this.entityType} repository returned null for upsert ID: ${pipedriveId}`,
        );
        return null;
      }

      return {
        ...result,
        entityType: this.entityType,
      } as unknown as PrismaModelResult;
    } catch (error) {
      logError(
        `Error during ${this.entityType} upsert strategy for ID ${pipedriveId}`,
        error,
      );
      return null;
    }
  }
}
