import {
  Controller,
  Post,
  Body,
  Logger,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { BasicAuthGuard } from '@src/auth/guards/basic-auth.guard';
import {
  PipedriveWebhookPayloadDto,
  BatchPipedriveWebhookPayloadDto,
} from './dtos/pipedrive-webhook.zod';
import { logError } from '@src/common/utils/logger.utils';
import { InjectQueue } from '@nestjs/bullmq';
import { JobsOptions, Queue } from 'bullmq';
import {
  WEBHOOK_QUEUE_TOKEN,
  WebhookJobName,
} from '@src/common/utils/queues.types';
import { PipedriveEntity } from './dtos/pipedrive.enum';
import { extractWebhookMetadata } from './utils/webhook-payload.utils';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    @InjectQueue(WEBHOOK_QUEUE_TOKEN)
    private readonly webhookQueue: Queue<
      PipedriveWebhookPayloadDto,
      any,
      WebhookJobName
    >,
  ) {}

  private getJobNameForPayload(
    payload: PipedriveWebhookPayloadDto,
  ): WebhookJobName {
    const entityType = payload.meta?.entity as PipedriveEntity;

    const jobNameMap = {
      [PipedriveEntity.PERSON]: WebhookJobName.PROCESS_PERSON_WEBHOOK,
      [PipedriveEntity.ORGANIZATION]:
        WebhookJobName.PROCESS_ORGANIZATION_WEBHOOK,
      [PipedriveEntity.DEAL]: WebhookJobName.PROCESS_DEAL_WEBHOOK,
      [PipedriveEntity.PIPELINE]: WebhookJobName.PROCESS_PIPELINE_WEBHOOK,
      [PipedriveEntity.STAGE]: WebhookJobName.PROCESS_STAGE_WEBHOOK,
      [PipedriveEntity.USER]: WebhookJobName.PROCESS_USER_WEBHOOK,
    };

    return jobNameMap[entityType] || WebhookJobName.PROCESS_UNKNOWN_WEBHOOK;
  }

  @Post('pipedrive')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  async handlePipedriveWebhook(
    @Body() payload: PipedriveWebhookPayloadDto,
  ): Promise<{
    status: string;
    jobId: string | undefined;
    jobName: WebhookJobName;
  }> {
    const { entity, action, pipedriveId, rawEntity } =
      extractWebhookMetadata(payload);

    const webhookEventId = payload.meta?.id;

    if (!webhookEventId) {
      this.logger.error(
        `Pipedrive Webhook (Entity: ${entity}, ID: ${pipedriveId}) is missing the 'meta.id' field, which is required for idempotency. Rejecting the request.`,
      );
      throw new BadRequestException(
        "Webhook payload missing 'meta.id' for idempotency key.",
      );
    }

    const jobId = `pipedrive-webhook-${webhookEventId}`;
    const jobName = this.getJobNameForPayload(payload);

    this.logger.log(
      `Received Pipedrive Webhook for ${
        rawEntity || entity
      } ${action} (Pipedrive ID: ${pipedriveId}). Adding job with Name: '${jobName}' and ID: '${jobId}' to BullMQ queue '${
        this.webhookQueue.name
      }'.`,
    );

    try {
      const job = await this.webhookQueue.add(jobName, payload, { jobId });

      this.logger.log(
        `Job added successfully: Name='${job.name}', ID='${job.id}' for Pipedrive ${
          rawEntity || entity
        } ID ${pipedriveId}.`,
      );

      return {
        status: 'queued',
        jobId: job.id,
        jobName: job.name,
      };
    } catch (error) {
      logError(
        `Error adding webhook job (Pipedrive ID: ${pipedriveId}, Job Name: ${jobName}) to BullMQ queue '${this.webhookQueue.name}'`,
        error,
      );
      throw error;
    }
  }

  @Post('pipedrive/batch')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  async handlePipedriveWebhookBatch(
    @Body() payload: BatchPipedriveWebhookPayloadDto,
  ): Promise<{
    status: string;
    jobs_added: number;
  }> {
    this.logger.log(
      `Received batch Pipedrive webhook request with ${payload.length} items.`,
    );

    const jobsToAdd: {
      name: WebhookJobName;
      data: PipedriveWebhookPayloadDto;
      opts?: JobsOptions;
    }[] = [];

    for (const item of payload) {
      const { entity, action, pipedriveId, rawEntity } =
        extractWebhookMetadata(item);

      const webhookEventId = item.meta?.id;

      if (!webhookEventId) {
        this.logger.error(
          `A Pipedrive webhook item in the batch (Entity: ${entity}, ID: ${pipedriveId}) is missing 'meta.id', which is required for idempotency. Rejecting the entire batch.`,
        );
        throw new BadRequestException(
          "One or more webhook payloads in the batch are missing 'meta.id' for idempotency key.",
        );
      }

      const jobId = `pipedrive-webhook-${webhookEventId}`;
      const jobName = this.getJobNameForPayload(item);

      this.logger.log(
        `[BATCH] Preparing job for ${
          rawEntity || entity
        } ${action} (Pipedrive ID: ${pipedriveId}). Job Name: '${jobName}', Job ID: '${jobId}'.`,
      );

      jobsToAdd.push({ name: jobName, data: item, opts: { jobId } });
    }

    try {
      await this.webhookQueue.addBulk(jobsToAdd);

      this.logger.log(
        `Successfully added ${jobsToAdd.length} jobs in bulk to the queue '${this.webhookQueue.name}'.`,
      );

      return {
        status: 'queued',
        jobs_added: jobsToAdd.length,
      };
    } catch (error) {
      logError(
        `Error adding batch webhook jobs to BullMQ queue '${this.webhookQueue.name}'`,
        error,
      );
      throw error;
    }
  }
}
