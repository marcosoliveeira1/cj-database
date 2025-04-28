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
    custom_fields: z.record(z.any()).nullable().optional(),
  })
  .passthrough();

const pipedriveOrganizationDataBaseSchema = z
  .object({
    id: z.number().int(),
    name: z.string().nullable().optional(),
    owner_id: z.number().int().nullable().optional(),
    people_count: z.coerce.number().int().nullable().optional(),
    open_deals_count: z.coerce.number().int().nullable().optional(),
    add_time: z.string().datetime({ offset: true }).nullable().optional(),
    update_time: z.string().datetime({ offset: true }).nullable().optional(),
    label_ids: z.array(z.number().int()).nullable().optional(),
    custom_fields: z.record(z.any()).nullable().optional(),
  })
  .passthrough();

const pipedriveDealDataBaseSchema = z
  .object({
    id: z.number().int(),
    title: z.string().nullable().optional(),
    custom_fields: z.record(z.any()).nullable().optional(),
  })
  .passthrough();

const webhookMetaSchema = z
  .object({
    action: z.string(),
    entity: z.string(),
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
      .optional(),
  })
  .passthrough();
export class PipedriveWebhookPayloadDto extends createZodDto(
  pipedriveWebhookSchema,
) {}
