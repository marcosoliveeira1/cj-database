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
