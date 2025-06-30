import { Injectable, Logger } from '@nestjs/common';
import { PipedriveApiService } from '@src/pipedrive-api/pipedrive-api.service';
import {
  dealFieldMappings,
  organizationFieldMappings,
  personFieldMappings,
  CustomFieldMappingType,
} from '@src/webhooks/custom-fields/custom-field.mappings';
import { MappedEntityType, SchemaFieldResponseDto } from './dto/schema.dto';

@Injectable()
export class SchemaService {
  private readonly logger = new Logger(SchemaService.name);

  constructor(private readonly pipedriveApi: PipedriveApiService) {}

  async getSchemaForEntity(
    entityType: MappedEntityType,
  ): Promise<SchemaFieldResponseDto[]> {
    this.logger.log(`Fetching schema and mappings for entity: ${entityType}`);

    const pipedriveFields = await this.pipedriveApi.getAllFields(entityType);
    const localMappings = this.getLocalMappings(entityType);

    if (!pipedriveFields) {
      this.logger.warn(
        `Could not fetch fields from Pipedrive for ${entityType}.`,
      );
      return [];
    }

    const combinedSchema = pipedriveFields.map((field, index) => {
      const localMapping = localMappings[field.key];

      return {
        id: index + 1,
        pipedrive_key: field.key,
        db_key: localMapping ? localMapping.prismaField : field.key,
        pipedrive_label: field.name,
        required: false,
      };
    });

    this.logger.log(
      `Successfully generated schema for ${entityType} with ${combinedSchema.length} fields.`,
    );
    return combinedSchema;
  }

  private getLocalMappings(
    entityType: MappedEntityType,
  ): CustomFieldMappingType {
    switch (entityType) {
      case 'deal':
        return dealFieldMappings;
      case 'person':
        return personFieldMappings;
      case 'organization':
        return organizationFieldMappings;
    }
  }
}
