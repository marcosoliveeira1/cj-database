import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'zod';

export const PipedriveContactDetailSchema = z
  .object({
    label: z.string().nullable().optional(),
    value: z.string(),
    primary: z.boolean().optional(),
  })
  .strict();

export const PipedrivePersonSchema = z
  .object({
    id: z.coerce.number().int(),
    name: z.string().nullable().optional(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    owner_id: z.coerce.number().int().nullable().optional(),
    org_id: z.coerce.number().int().nullable().optional(),
    add_time: z.string().datetime({ offset: true }).nullable().optional(),
    update_time: z.string().datetime({ offset: true }).nullable().optional(),
    emails: z.array(PipedriveContactDetailSchema).nullable().optional(),
    phones: z.array(PipedriveContactDetailSchema).nullable().optional(),
    label_ids: z.array(z.coerce.number().int()).nullable().optional(),
    visible_to: z.string().nullable().optional(),
    custom_fields: z.record(z.any()).nullable().optional(),
  })
  .passthrough();

export const PipedriveOrganizationSchema = z
  .object({
    id: z.coerce.number().int(),
    name: z.string().nullable().optional(),
    owner_id: z.coerce.number().int().nullable().optional(),
    add_time: z.string().datetime({ offset: true }).nullable().optional(),
    update_time: z.string().datetime({ offset: true }).nullable().optional(),
    label_ids: z.array(z.coerce.number().int()).nullable().optional(),
    visible_to: z.string().nullable().optional(),
    custom_fields: z.record(z.any()).nullable().optional(),
  })
  .passthrough();

export const PipedriveDealSchema = z
  .object({
    id: z.coerce.number().int(),
    title: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    value: z.number().nullable().optional(),
    currency: z.string().nullable().optional(),
    user_id: z.coerce.number().int().nullable().optional(),
    owner_id: z.coerce.number().int().nullable().optional(),
    person_id: z.coerce.number().int().nullable().optional(),
    org_id: z.coerce.number().int().nullable().optional(),
    pipeline_id: z.coerce.number().int().nullable().optional(),
    stage_id: z.coerce.number().int().nullable().optional(),
    status: z.string().nullable().optional(),
    lost_reason: z.string().nullable().optional(),
    add_time: z.string().datetime({ offset: true }).nullable().optional(),
    update_time: z.string().datetime({ offset: true }).nullable().optional(),
    stage_change_time: z
      .string()
      .datetime({ offset: true })
      .nullable()
      .optional(),
    next_activity_date: z.string().date().nullable().optional(),
    last_activity_date: z.string().date().nullable().optional(),
    won_time: z.string().datetime({ offset: true }).nullable().optional(),
    lost_time: z.string().datetime({ offset: true }).nullable().optional(),
    close_time: z.string().datetime({ offset: true }).nullable().optional(),
    expected_close_date: z.string().date().nullable().optional(),
    probability: z.number().int().nullable().optional(),
    label_ids: z.array(z.coerce.number().int()).nullable().optional(),
    visible_to: z.string().nullable().optional(),
    activities_count: z.number().int().optional().nullable(),
    done_activities_count: z.number().int().optional().nullable(),
    undone_activities_count: z.number().int().optional().nullable(),
    email_messages_count: z.number().int().optional().nullable(),
    weighted_value: z.number().optional().nullable(),
    weighted_value_currency: z.string().optional().nullable(),
    origin: z.string().optional().nullable(),
    origin_id: z.string().optional().nullable(),
    channel_id: z.string().optional().nullable(),
    is_archived: z.boolean().optional().nullable(),
    archive_time: z.string().datetime({ offset: true }).optional().nullable(),
    creator_user_id: z.coerce.number().int().optional().nullable(),
    custom_fields: z.record(z.any()).nullable().optional(),
  })
  .passthrough();

export const PipedrivePipelineSchema = z
  .object({
    id: z.coerce.number().int(),
    name: z.string().nullable().optional(),
    url_title: z.string().nullable().optional(),
    order_nr: z.number().int().nullable().optional(),
    active_flag: z.boolean().optional(),
    deal_probability: z.boolean().optional(),
    add_time: z.string().datetime({ offset: true }).nullable().optional(),
    update_time: z.string().datetime({ offset: true }).nullable().optional(),
  })
  .passthrough();

export const PipedriveStageSchema = z
  .object({
    id: z.coerce.number().int(),
    name: z.string().nullable().optional(),
    order_nr: z.number().int().nullable().optional(),
    pipeline_id: z.coerce.number().int().nullable().optional(),
    active_flag: z.boolean().optional(),
    deal_probability: z.number().int().nullable().optional(),
    rotten_flag: z.boolean().optional(),
    rotten_days: z.number().int().nullable().optional(),
    add_time: z.string().datetime({ offset: true }).nullable().optional(),
    update_time: z.string().datetime({ offset: true }).nullable().optional(),
  })
  .passthrough();

export const PipedriveUserSchema = z
  .object({
    id: z.coerce.number().int(),
    name: z.string(),
    email: z.string().email().nullable().optional(),
    phone: z.string().nullable().optional(),
    created: z.string().nullable().optional(),
    modified: z.string().nullable().optional(),
    last_login: z.string().datetime({ offset: true }).nullable().optional(),
    active_flag: z.boolean().optional(),
    icon_url: z.string().url().nullable().optional(),
  })
  .passthrough();

const webhookMetaSchema = z
  .object({
    action: z.string(),
    entity: z.string(),
    id: z.string().optional(),
  })
  .passthrough();

export const PipedriveWebhookPayloadSchema = z
  .object({
    meta: webhookMetaSchema,
    data: z
      .union([
        PipedrivePersonSchema,
        PipedriveOrganizationSchema,
        PipedriveDealSchema,
        PipedrivePipelineSchema,
        PipedriveStageSchema,
        PipedriveUserSchema,
      ])
      .nullable()
      .optional(),
  })
  .passthrough();

export class PipedriveWebhookPayloadDto extends createZodDto(
  PipedriveWebhookPayloadSchema,
) {}

export const BatchPipedriveWebhookPayloadSchema = z.array(
  PipedriveWebhookPayloadSchema,
);

export class BatchPipedriveWebhookPayloadDto extends createZodDto(
  BatchPipedriveWebhookPayloadSchema,
) {}
