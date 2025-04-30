export type OrganizationInput = PipedriveCommonData;

export type PersonInput = {
  emails: EmailInput[] | null;
  first_name: string;
  last_name: string;
  org_id: number | null;
  phones: PhoneInput[] | null;
} & PipedriveCommonData;

type PipedriveCommonData = {
  add_time: string;
  id: number;
  label_ids: number[] | null;
  name: string;
  owner_id: number | null;
  visible_to: string | null;
  update_time: string;
  custom_fields: Record<string, any> | null;
};

export type DealInput = {
  title: string | null;
  value: number | null;
  currency: string | null;
  owner_id: number | null;
  person_id: number | null;
  org_id: number | null;
  stage_id: number | null;
  status: string | null;
  lost_reason: string | null;
  expected_close_date: string | null;
  probability: number | null;
  pipeline_id: number | null;
  won_time: string | null;
  lost_time: string | null;
  close_time: string | null;
  stage_change_time: string | null;
  next_activity_date: string | null;
  last_activity_date: string | null;
  activities_count?: number | null;
  done_activities_count?: number | null;
  undone_activities_count?: number | null;
  email_messages_count?: number | null;
  weighted_value?: number | null;
  weighted_value_currency?: string | null;
  origin?: string | null;
  origin_id?: string | null;
  channel_id?: string | null;
  is_archived?: boolean | null;
  archive_time?: string | null;
  creator_user_id?: number | null;
} & PipedriveCommonData;

export type EmailInput = {
  label: string;
  value: string;
  primary: boolean;
};

export type PhoneInput = {
  label: string;
  value: string;
  primary: boolean;
};
