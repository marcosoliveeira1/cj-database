import { Injectable, Logger } from '@nestjs/common';
import { OrganizationUpsertStrategy } from './strategies/organization-upsert.strategy';

import { PipedriveWebhookPayloadDto } from '../dtos/pipedrive-webhook.zod';
import { PipedriveAction, PipedriveEntity } from '../dtos/pipedrive.enum';
import {
  IUpsertStrategy,
  PipedriveData,
} from './strategies/base-upsert.strategy';
import { logError } from '@src/common/utils/logger.utils';
import { PersonUpsertStrategy } from './strategies/person-upsert.strategy';

@Injectable()
export class WebhookProcessingService {
  private readonly logger = new Logger(WebhookProcessingService.name);

  private readonly strategyMap: Partial<
    Record<PipedriveEntity, IUpsertStrategy>
  > = {};

  constructor(
    private readonly orgStrategy: OrganizationUpsertStrategy,
    private readonly personStrategy: PersonUpsertStrategy,
  ) {
    this.strategyMap = {
      [PipedriveEntity.ORGANIZATION]: this.orgStrategy,
      [PipedriveEntity.PERSON]: this.personStrategy,
    };
  }

  getStrategy(entity: PipedriveEntity): IUpsertStrategy | undefined {
    return this.strategyMap[entity];
  }

  async processWebhook(payload: PipedriveWebhookPayloadDto): Promise<void> {
    if (!payload.meta?.entity || !payload.meta?.action) {
      this.logger.warn(
        `Received webhook with invalid meta or missing data/ID for non-delete action. Skipping. Meta: ${JSON.stringify(payload.meta)}, Data ID: ${payload.data?.id}`,
      );
      return;
    }

    const entityType = payload.meta.entity as PipedriveEntity;
    const action = payload.meta.action as PipedriveAction;

    const data = payload.data as PipedriveData;

    if (!data?.id && action !== PipedriveAction.DELETE) {
      this.logger.warn(
        `Webhook for ${action} ${entityType} has no data or ID. Skipping.`,
      );
      return;
    }

    this.logger.log(
      `Processing webhook: ${action} ${entityType} (Pipedrive ID: ${data?.id ?? 'N/A'})`,
    );

    try {
      const strategy = this.getStrategy(entityType);

      if (!strategy) {
        this.logger.warn(
          `No upsert strategy found for entity type: '${entityType}'. Skipping.`,
        );
        return;
      }

      if (!data) {
        this.logger.warn(
          `No data found for upsert operation on ${entityType}. Skipping.`,
        );
        return;
      }

      const result = await strategy.upsert(data);

      if (!result) {
        this.logger.warn(
          `Upsert strategy failed or returned null for ${entityType} ID ${data.id}. Check strategy/repository logs for details.`,
        );
        return;
      }

      if (result && !result.updatedAt && action === PipedriveAction.CHANGE) {
        this.logger.log(
          `Successfully processed ${action} event for ${entityType} ID ${data.id} (no previous data found)`,
        );
        return;
      }
      this.logger.log(
        `Successfully processed ${action} event for ${entityType} ID ${data.id}`,
      );
    } catch (error) {
      logError(
        `Unexpected error processing ${entityType} ID ${data?.id ?? 'N/A'}`,
        error,
      );
    }
  }
}
