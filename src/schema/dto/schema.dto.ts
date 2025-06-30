export class SchemaFieldResponseDto {
  id: number;
  pipedrive_key: string;
  db_key: string;
  pipedrive_label: string;
  required: boolean;
}

export type MappedEntityType = 'deal' | 'person' | 'organization';
