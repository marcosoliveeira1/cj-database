import {
  Controller,
  Post,
  Body,
  Logger,
  UseGuards,
  HttpCode,
  HttpStatus,

} from '@nestjs/common';
import { BasicAuthGuard } from '@src/auth/guards/basic-auth.guard';
import { PipedriveWebhookPayloadDto } from './dtos/pipedrive-webhook.zod';
import { logError } from '@src/common/utils/logger.utils';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WEBHOOK_QUEUE_TOKEN, WebhookJobName } from '@src/common/utils/queues.types';
import { PipedriveEntity } from './dtos/pipedrive.enum';
import { extractWebhookMetadata } from './utils/webhook-payload.utils';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    @InjectQueue(WEBHOOK_QUEUE_TOKEN) private readonly webhookQueue: Queue<PipedriveWebhookPayloadDto, any, WebhookJobName>,
  ) { }

  private getJobNameForPayload(payload: PipedriveWebhookPayloadDto): WebhookJobName {
    const entityType = payload.meta?.entity as PipedriveEntity;

    const jobNameMap = {
      [PipedriveEntity.PERSON]: WebhookJobName.PROCESS_PERSON_WEBHOOK,
      [PipedriveEntity.ORGANIZATION]: WebhookJobName.PROCESS_ORGANIZATION_WEBHOOK,
      [PipedriveEntity.DEAL]: WebhookJobName.PROCESS_DEAL_WEBHOOK,
    }

    return jobNameMap[entityType] || WebhookJobName.PROCESS_UNKNOWN_WEBHOOK;
  }

  @Post('pipedrive')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  async handlePipedriveWebhook(
    @Body() payload: PipedriveWebhookPayloadDto,
  ): Promise<{ status: string; jobId: string | undefined; jobName: WebhookJobName }> {
    const { entity, action, pipedriveId, rawEntity } = extractWebhookMetadata(payload);

    const jobId = `pipedrive-${entity}-${pipedriveId}-${Date.now()}`;
    const jobName = this.getJobNameForPayload(payload);

    this.logger.log(
      `Received Pipedrive Webhook for ${rawEntity || entity} ${action} (Pipedrive ID: ${pipedriveId}). Adding job with Name: '${jobName}' and ID: '${jobId}' to BullMQ queue '${this.webhookQueue.name}'.`,
    );

    try {
      const job = await this.webhookQueue.add(jobName, payload, { jobId });

      this.logger.log(`Job added successfully: Name='${job.name}', ID='${job.id}' for Pipedrive ${rawEntity || entity} ID ${pipedriveId}.`);

      return { status: 'queued', jobId: job.id, jobName: job.name as WebhookJobName };

    } catch (error) {
      logError(
        `Error adding webhook job (Pipedrive ID: ${pipedriveId}, Job Name: ${jobName}) to BullMQ queue '${this.webhookQueue.name}'`,
        error,
      );
      throw error;
    }
  }
}