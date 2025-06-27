import { Injectable, Logger } from '@nestjs/common';
import { OrganizationUpsertStrategy } from './strategies/organization-upsert.strategy';
import { PipedriveWebhookPayloadDto } from '../dtos/pipedrive-webhook.zod';
import { PipedriveAction, PipedriveEntity } from '../dtos/pipedrive.enum';
import {
  IUpsertStrategy,
  PipedriveData,
  PrismaModelResult,
} from './strategies/base-upsert.strategy';
import { logError } from '@src/common/utils/logger.utils';
import { PersonUpsertStrategy } from './strategies/person-upsert.strategy';
import { DealUpsertStrategy } from './strategies/deal-upsert.strategy';
import { extractWebhookMetadata } from '../utils/webhook-payload.utils';

@Injectable()
export class WebhookProcessingService {
  private readonly logger = new Logger(WebhookProcessingService.name);
  private readonly strategyMap: Partial<
    Record<PipedriveEntity, IUpsertStrategy>
  >;

  constructor(
    private readonly orgStrategy: OrganizationUpsertStrategy,
    private readonly personStrategy: PersonUpsertStrategy,
    private readonly dealStrategy: DealUpsertStrategy,
  ) {
    this.strategyMap = {
      [PipedriveEntity.ORGANIZATION]: this.orgStrategy,
      [PipedriveEntity.PERSON]: this.personStrategy,
      [PipedriveEntity.DEAL]: this.dealStrategy,
    };
  }

  async processWebhook(
    payload: PipedriveWebhookPayloadDto,
  ): Promise<PrismaModelResult | null> {
    const { entity, action, pipedriveId, rawEntity } =
      extractWebhookMetadata(payload);

    this.logger.debug(
      `Processing Service: Executing logic for: ${action} ${rawEntity || entity} (Pipedrive ID: ${pipedriveId})`,
    );

    if (entity === 'unknown-entity' || action === 'unknown-action') {
      this.logger.warn(
        `Invalid meta for processing (Pipedrive ID: ${pipedriveId}). Entity: '${rawEntity || entity}', Action: '${action}'. Skipping. Meta: ${JSON.stringify(payload.meta)}`,
      );
      throw new Error(
        `Invalid meta data (entity or action unknown) for Pipedrive ID: ${pipedriveId}`,
      );
    }

    const data = payload.data as PipedriveData | undefined;

    if (!data) {
      this.logger.warn(
        `Processing for ${action} ${entity} (Pipedrive ID: ${pipedriveId}) has no data. Skipping.`,
      );
      return null;
    }

    if (
      action !== PipedriveAction.CREATE &&
      action !== PipedriveAction.CHANGE
    ) {
      this.logger.warn(
        `Processing for ${action} ${entity} (Pipedrive ID: ${pipedriveId}) - Only CREATE and CHANGE actions are supported. Skipping.`,
      );
      return null;
    }

    const strategy = this.getStrategy(entity);

    if (!strategy) {
      this.logger.warn(
        `No upsert strategy found for entity type: '${entity}' (Pipedrive ID: ${pipedriveId}). Skipping.`,
      );
      throw new Error(
        `No strategy for ${entity} (Pipedrive ID: ${pipedriveId})`,
      );
    }

    try {
      const result = await strategy.upsert(data);

      if (!result) {
        this.logger.warn(
          `Upsert strategy returned null for ${entity} Pipedrive ID ${pipedriveId}.`,
        );
        return null;
      } else {
        this.logger.log(
          `Successfully executed strategy for ${entity} Pipedrive ID ${pipedriveId}. Result ID: ${result.id}`,
        );
        return result;
      }
    } catch (error) {
      logError(
        `Error during ${entity} processing logic for Pipedrive ID ${pipedriveId}`,
        error,
      );
      throw error;
    }
  }

  private getStrategy(entity: PipedriveEntity): IUpsertStrategy | undefined {
    return this.strategyMap[entity];
  }
}
