import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prismaClient';
import {
  parseDate,
  safeParseInt,
} from '@src/common/mapping/utils/mapping.utils';
import { IMapper } from '@src/common/mapping/interfaces/mapper.interface';
import { OrganizationInput } from '@src/webhooks/dtos/pipedrive.dto';
import { CustomFieldMapperHelper } from '@src/webhooks/custom-fields/custom-field-mapping.helper';

@Injectable()
export class OrganizationMapper
  implements
  IMapper<
    OrganizationInput,
    Prisma.OrganizationCreateInput,
    Prisma.OrganizationUpdateInput
  > {
  private readonly logger = new Logger(OrganizationMapper.name);

  constructor(private readonly customFieldMapperHelper: CustomFieldMapperHelper
  ) { }

  private mapCustomFields(data: OrganizationInput): Partial<Prisma.OrganizationCreateInput> {
    return this.customFieldMapperHelper.mapCustomFieldsToInput('organization', data.custom_fields);
  }

  toCreateInput(data: OrganizationInput): Prisma.OrganizationCreateInput {
    const customFields = this.mapCustomFields(data);

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
    const customFields = this.mapCustomFields(data);

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
