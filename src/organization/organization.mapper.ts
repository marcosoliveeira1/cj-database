import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prismaClient';
import { parseDate } from '@src/common/mapping/utils/mapping.utils';
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
    >
{
  private readonly logger = new Logger(OrganizationMapper.name);

  constructor(
    private readonly customFieldMapperHelper: CustomFieldMapperHelper,
  ) {}

  private async mapCustomFields(
    data: OrganizationInput,
  ): Promise<Partial<Prisma.OrganizationCreateInput>> {
    return await this.customFieldMapperHelper.mapCustomFieldsToInput(
      'organization',
      data,
    );
  }

  async toCreateInput(
    data: OrganizationInput,
  ): Promise<Prisma.OrganizationCreateInput> {
    const customFields = await this.mapCustomFields(data);

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

  async toUpdateInput(
    data: OrganizationInput,
  ): Promise<Prisma.OrganizationUpdateInput> {
    const customFields = await this.mapCustomFields(data);

    return {
      name: data.name,
      ownerId: data.owner_id,
      visibleTo: data.visible_to,
      labelIds: data.label_ids?.join(','),
      pipedriveAddTime: parseDate(data.add_time),
      pipedriveUpdateTime: parseDate(data.update_time),
      ...customFields,
      sync_status: 'synced',
    };
  }
}
