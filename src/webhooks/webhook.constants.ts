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
    PROCESS_UNKNOWN_WEBHOOK = 'process-unknown-webhook',
}
