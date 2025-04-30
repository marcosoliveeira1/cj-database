import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'zod';

const contactDetailSchema = z
  .object({
    label: z.string().optional(),
    value: z.string(),
    primary: z.boolean().optional(),
  })
  .strict();

const pipedrivePersonDataBaseSchema = z
  .object({
    id: z.number().int(),
    name: z.string().nullable().optional(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    owner_id: z.number().int().nullable().optional(),
    org_id: z.number().int().nullable().optional(),
    add_time: z.string().datetime({ offset: true }).nullable().optional(),
    update_time: z.string().datetime({ offset: true }).nullable().optional(),
    emails: z.array(contactDetailSchema).nullable().optional(),
    phones: z.array(contactDetailSchema).nullable().optional(),
    label_ids: z.array(z.number().int()).nullable().optional(),
    visible_to: z.string().nullable().optional(),
    custom_fields: z.record(z.any()).nullable().optional(),
  })
  .passthrough();

const pipedriveOrganizationDataBaseSchema = z
  .object({
    id: z.number().int(),
    name: z.string().nullable().optional(),
    owner_id: z.number().int().nullable().optional(),

    add_time: z.string().datetime({ offset: true }).nullable().optional(),
    update_time: z.string().datetime({ offset: true }).nullable().optional(),
    label_ids: z.array(z.number().int()).nullable().optional(),
    visible_to: z.string().nullable().optional(),
    custom_fields: z.record(z.any()).nullable().optional(),
  })
  .passthrough();

const pipedriveDealDataBaseSchema = z
  .object({
    id: z.number().int(),
    title: z.string().nullable().optional(),
    value: z.number().nullable().optional(),
    currency: z.string().nullable().optional(),
    user_id: z.number().int().nullable().optional(),
    person_id: z.number().int().nullable().optional(),
    org_id: z.number().int().nullable().optional(),
    pipeline_id: z.number().int().nullable().optional(),
    stage_id: z.number().int().nullable().optional(),
    status: z.string().nullable().optional(),
    lost_reason: z.string().nullable().optional(),
    add_time: z.string().datetime({ offset: true }).nullable().optional(),
    update_time: z.string().datetime({ offset: true }).nullable().optional(),
    stage_change_time: z
      .string()
      .datetime({ offset: true })
      .nullable()
      .optional(),
    won_time: z.string().datetime({ offset: true }).nullable().optional(),
    lost_time: z.string().datetime({ offset: true }).nullable().optional(),
    close_time: z.string().datetime({ offset: true }).nullable().optional(),
    expected_close_date: z.string().date().nullable().optional(),
    probability: z.number().int().nullable().optional(),
    label: z.array(z.number().int()).nullable().optional(),
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
    creator_user_id: z.number().int().optional().nullable(),

    custom_fields: z.record(z.any()).nullable().optional(),
  })
  .passthrough();

const webhookMetaSchema = z
  .object({
    action: z.string(),
    entity: z.string(),

    id: z.string().optional(),
  })
  .passthrough();

const pipedriveWebhookSchema = z
  .object({
    meta: webhookMetaSchema,

    data: z
      .union([
        pipedrivePersonDataBaseSchema,
        pipedriveOrganizationDataBaseSchema,
        pipedriveDealDataBaseSchema,
      ])
      .nullable()
      .optional(),
  })
  .passthrough();

export class PipedriveWebhookPayloadDto extends createZodDto(
  pipedriveWebhookSchema,
) {}
