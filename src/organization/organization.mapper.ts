import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prismaClient';
import { CustomFieldMappingService } from '@src/webhooks/custom-fields/custom-field-mapping.service';
import {
  parseDate,
  safeParseInt,
} from '@src/common/mapping/utils/mapping.utils';
import { IMapper } from '@src/common/mapping/interfaces/mapper.interface';
import { OrganizationInput } from '@src/webhooks/dtos/pipedrive.dto';

@Injectable()
export class OrganizationMapper
  implements
    IMapper<
      OrganizationInput,
      Prisma.OrganizationCreateInput,
      Prisma.OrganizationUpdateInput
    >
{
  private readonly logger = new Logger(OrganizationMapper.name);

  constructor(private readonly customFieldMapper: CustomFieldMappingService) {}

  private mapCustomFields(
    customFieldsData: Record<string, any> | null | undefined,
  ): Record<string, any> {
    const mappedFields: Record<string, any> = {};
    if (!customFieldsData) return mappedFields;

    const mapping = this.customFieldMapper.getMappingFor('organization');

    for (const [pipedriveKey, value] of Object.entries(customFieldsData)) {
      const mapInfo = mapping[pipedriveKey];
      if (mapInfo) {
        const { prismaField, type } = mapInfo;
        let preparedValue: unknown = value;
        if (value !== null && value !== undefined) {
          if (type === 'date' || type === 'datetime' || type === 'time') {
            preparedValue = parseDate(value as string);
          } else if (type === 'int') {
            preparedValue = safeParseInt(value);
          }
        }
        mappedFields[prismaField] = preparedValue;
      }
    }
    return mappedFields;
  }

  toCreateInput(data: OrganizationInput): Prisma.OrganizationCreateInput {
    const customFields = this.mapCustomFields(data.custom_fields);

    return {
      id: data.id,
      name: data.name,
      ownerId: data.owner_id,
      visibleTo: data.visible_to,
      labelIds: data.label_ids?.join(','),
      pipedriveAddTime: parseDate(data.add_time),
      pipedriveUpdateTime: parseDate(data.update_time),
      ...customFields,
    };
  }

  toUpdateInput(data: OrganizationInput): Prisma.OrganizationUpdateInput {
    const customFields = this.mapCustomFields(data.custom_fields);

    return {
      name: data.name,
      ownerId: data.owner_id,
      visibleTo: data.visible_to,
      labelIds: data.label_ids?.join(','),
      pipedriveAddTime: parseDate(data.add_time),
      pipedriveUpdateTime: parseDate(data.update_time),
      ...customFields,
    };
  }
}
