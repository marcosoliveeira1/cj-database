import { PipedriveWebhookPayloadDto } from '../dtos/pipedrive-webhook.zod';
import { PipedriveEntity, PipedriveAction } from '../dtos/pipedrive.enum';

export interface ExtractedWebhookMetadata {
    entity: PipedriveEntity | 'unknown-entity';
    action: PipedriveAction | 'unknown-action';
    pipedriveId: number | string;
    rawEntity?: string;
    rawAction?: string;
}

export function extractWebhookMetadata(payload: PipedriveWebhookPayloadDto): ExtractedWebhookMetadata {
    const rawEntity = payload.meta?.entity;
    const rawAction = payload.meta?.action;

    const entity = Object.values(PipedriveEntity).includes(rawEntity as PipedriveEntity)
        ? rawEntity as PipedriveEntity
        : 'unknown-entity';

    const action = Object.values(PipedriveAction).includes(rawAction as PipedriveAction)
        ? rawAction as PipedriveAction
        : 'unknown-action';

    const pipedriveId = payload.data?.id ?? payload.meta?.id ?? 'N/A';

    return {
        entity,
        action,
        pipedriveId,
        ...(entity === 'unknown-entity' && rawEntity && { rawEntity }),
        ...(action === 'unknown-action' && rawAction && { rawAction }),
    };
}