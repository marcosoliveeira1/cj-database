import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { WebhookProcessingService } from './webhook-processing.service';
import { PipedriveWebhookPayloadDto } from '../dtos/pipedrive-webhook.zod';
import { WEBHOOK_QUEUE_TOKEN, WebhookJobName } from '../webhook.constants';
import { logError } from '@src/common/utils/logger.utils';
import { extractWebhookMetadata } from '../utils/webhook-payload.utils';

@Processor(WEBHOOK_QUEUE_TOKEN)
export class WebhookProcessor extends WorkerHost {
    private readonly logger: Logger;

    constructor(
        private readonly webhookProcessingService: WebhookProcessingService,
    ) {
        super();
        this.logger = new Logger(WebhookProcessor.name);
    }

    async process(job: Job<PipedriveWebhookPayloadDto, any, WebhookJobName>): Promise<void> {
        const payload = job.data;
        const jobName = job.name;
        const { entity, action, pipedriveId, rawEntity } = extractWebhookMetadata(payload);
        const queueName = job.queueName;
        const jobId = job.id;

        this.logger.log(
            `[Queue: ${queueName}] Processing job ID: ${jobId} (Job Name: ${jobName}) - ${action} ${rawEntity || entity} (Pipedrive ID: ${pipedriveId}) - Attempt #${job.attemptsMade + 1}`,
        );

        try {
            switch (jobName) {
                case WebhookJobName.PROCESS_PERSON_WEBHOOK:
                case WebhookJobName.PROCESS_ORGANIZATION_WEBHOOK:
                case WebhookJobName.PROCESS_DEAL_WEBHOOK:
                    this.logger.debug(`Job ${jobId} (Name: ${jobName}) is a known Pipedrive entity webhook. Delegating to WebhookProcessingService.`);
                    await this.webhookProcessingService.processWebhook(payload);
                    break;
                case WebhookJobName.PROCESS_UNKNOWN_WEBHOOK:
                    this.logger.warn(
                        `[Queue: ${queueName}] Job ID: ${jobId} (Name: ${jobName}) for an unknown entity: '${rawEntity || entity}'. Check payload for details.`,
                    );
                    break;
                default:
                    this.logger.error(
                        `[Queue: ${queueName}] Unrecognized job name: '${jobName}' for job ID: ${jobId}. This indicates a potential issue in job producer or constants.`,
                    );
                    throw new Error(`Unrecognized job name: ${jobName}`);
            }

            this.logger.log(
                `[Queue: ${queueName}] Successfully processed job ID: ${jobId} (Job Name: ${jobName}) for Pipedrive ${rawEntity || entity} ID ${pipedriveId}`,
            );
        } catch (error) {
            logError(
                `[Queue: ${queueName}] Failed to process job ID: ${jobId} (Job Name: ${jobName}, Pipedrive ID: ${pipedriveId}, Attempt #${job.attemptsMade + 1})`,
                error,
            );
            throw error;
        }
    }
}