import { z } from 'zod';
import {
  PipedriveOrganizationSchema,
  PipedrivePersonSchema,
  PipedriveDealSchema,
  PipedriveContactDetailSchema,
  PipedrivePipelineSchema,
  PipedriveStageSchema,
  PipedriveUserSchema,
} from './pipedrive-webhook.zod';

export type OrganizationInput = z.infer<typeof PipedriveOrganizationSchema>;
export type PersonInput = z.infer<typeof PipedrivePersonSchema>;
export type DealInput = z.infer<typeof PipedriveDealSchema>;
export type PipelineInput = z.infer<typeof PipedrivePipelineSchema>;
export type StageInput = z.infer<typeof PipedriveStageSchema>;
export type UserInput = z.infer<typeof PipedriveUserSchema>;

export type EmailInput = z.infer<typeof PipedriveContactDetailSchema>;
export type PhoneInput = z.infer<typeof PipedriveContactDetailSchema>;
