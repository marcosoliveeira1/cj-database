/**
 * Token de injeção para a fila de webhooks no NestJS.
 * Usado para injetar a instância da fila (`@InjectQueue(WEBHOOK_QUEUE_TOKEN)`).
 */
export const WEBHOOK_QUEUE_TOKEN = 'webhook-processing-queue';

/**
 * Nomes dos jobs que podem ser processados pela fila de webhooks.
 */
export const enum WebhookJobName {
  PROCESS_PERSON_WEBHOOK = 'process-person-webhook',
  PROCESS_ORGANIZATION_WEBHOOK = 'process-organization-webhook',
  PROCESS_DEAL_WEBHOOK = 'process-deal-webhook',
  PROCESS_PIPELINE_WEBHOOK = 'process-pipeline-webhook',
  PROCESS_STAGE_WEBHOOK = 'process-stage-webhook',
  PROCESS_USER_WEBHOOK = 'process-user-webhook',
  PROCESS_UNKNOWN_WEBHOOK = 'process-unknown-webhook',
}

export type ManagedEntityType =
  | 'organization'
  | 'person'
  | 'pipeline'
  | 'stage'
  | 'user';

export const ENTITY_SYNC_QUEUE_TOKEN = 'entity-sync-queue';

export enum EntitySyncJobName {
  SYNC_ORGANIZATION = 'sync-organization',
  SYNC_PERSON = 'sync-person',
  SYNC_PIPELINE = 'sync-pipeline',
  SYNC_STAGE = 'sync-stage',
  SYNC_USER = 'sync-user',
}

export type EntitySyncJobPayload = {
  entityType: ManagedEntityType;
  entityId: number;
};
