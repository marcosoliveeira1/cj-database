import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prismaClient';
import { IMapper } from '@src/common/mapping/interfaces/mapper.interface';
import { DealInput } from '@src/webhooks/dtos/pipedrive.dto';
import { CustomFieldMapperHelper } from '@src/webhooks/custom-fields/custom-field-mapping.helper';

@Injectable()
export class DealMapper
  implements IMapper<DealInput, Prisma.DealCreateInput, Prisma.DealUpdateInput>
{
  private readonly logger = new Logger(DealMapper.name);

  constructor(
    private readonly customFieldMapperHelper: CustomFieldMapperHelper,
  ) {}
  private mapCustomFields(data: DealInput): Partial<Prisma.DealCreateInput> {
    return this.customFieldMapperHelper.mapCustomFieldsToInput(
      'deal',
      data.custom_fields,
    );
  }

  toCreateInput(data: DealInput): Prisma.DealCreateInput {
    const mappedFields = this.mapCustomFields(data);

    const createInput: Prisma.DealCreateInput = {
      id: data.id,
      ...mappedFields,
      organization: data.org_id ? { connect: { id: data.org_id } } : undefined,
      person: data.person_id ? { connect: { id: data.person_id } } : undefined,
    };

    return createInput;
  }

  toUpdateInput(data: DealInput): Prisma.DealUpdateInput {
    const mappedFields = this.mapCustomFields(data);

    let orgUpdate:
      | Prisma.OrganizationUpdateOneWithoutDealsNestedInput
      | undefined;
    if ('org_id' in data) {
      orgUpdate =
        data.org_id === null
          ? { disconnect: true }
          : { connect: { id: data.org_id } };
    }

    let personUpdate: Prisma.PersonUpdateOneWithoutDealsNestedInput | undefined;
    if ('person_id' in data) {
      personUpdate =
        data.person_id === null
          ? { disconnect: true }
          : { connect: { id: data.person_id } };
    }

    const updateInput: Prisma.DealUpdateInput = {
      ...mappedFields,
      organization: orgUpdate,
      person: personUpdate,
    };

    return updateInput;
  }
}
