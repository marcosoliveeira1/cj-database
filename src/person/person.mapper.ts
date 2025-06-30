import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prismaClient';
import { parseDate } from '@src/common/mapping/utils/mapping.utils';
import { IMapper } from '@src/common/mapping/interfaces/mapper.interface';
import {
  EmailInput,
  PersonInput,
  PhoneInput,
} from '@src/webhooks/dtos/pipedrive.dto';
import { CustomFieldMapperHelper } from '@src/webhooks/custom-fields/custom-field-mapping.helper';

@Injectable()
export class PersonMapper
  implements
    IMapper<PersonInput, Prisma.PersonCreateInput, Prisma.PersonUpdateInput>
{
  private readonly logger = new Logger(PersonMapper.name);

  constructor(
    private readonly customFieldMapperHelper: CustomFieldMapperHelper,
  ) {}

  private async mapCustomFields(
    data: PersonInput,
  ): Promise<Partial<Prisma.PersonCreateInput>> {
    return await this.customFieldMapperHelper.mapCustomFieldsToInput(
      'person',
      data,
    );
  }
  private prepareEmailInput(
    emails: EmailInput[] | null,
  ): Prisma.PersonEmailCreateNestedManyWithoutPersonInput {
    const emailsToCreate = (emails || [])
      .map((email) => ({
        label: email.label,
        value: email.value,
        primary: email.primary || false,
      }))
      .filter((e) => e.value);
    return { create: emailsToCreate };
  }

  private preparePhoneInput(
    phones: PhoneInput[] | null,
  ): Prisma.PersonPhoneCreateNestedManyWithoutPersonInput {
    const phonesToCreate = (phones || [])
      .map((phone) => ({
        label: phone.label,
        value: phone.value,
        primary: phone.primary || false,
      }))
      .filter((p) => p.value);
    return { create: phonesToCreate };
  }

  async toCreateInput(data: PersonInput): Promise<Prisma.PersonCreateInput> {
    const customFields = await this.mapCustomFields(data);

    return {
      id: data.id,
      name: data.name,
      firstName: data.first_name,
      lastName: data.last_name,
      ownerId: data.owner_id,
      pipedriveAddTime: parseDate(data.add_time),
      pipedriveUpdateTime: parseDate(data.update_time),
      visibleTo: data.visible_to,
      ...customFields,
      emails: this.prepareEmailInput(data.emails ?? null),
      phones: this.preparePhoneInput(data.phones ?? null),
      organization: data.org_id ? { connect: { id: data.org_id } } : undefined,
    };
  }

  async toUpdateInput(data: PersonInput): Promise<Prisma.PersonUpdateInput> {
    const customFields = await this.mapCustomFields(data);

    let orgUpdate:
      | Prisma.OrganizationUpdateOneWithoutPersonsNestedInput
      | undefined;
    if (data.org_id !== undefined) {
      orgUpdate =
        data.org_id === null
          ? { disconnect: true }
          : { connect: { id: data.org_id } };
    }

    return {
      name: data.name,
      firstName: data.first_name,
      lastName: data.last_name,
      ownerId: data.owner_id,
      pipedriveAddTime: parseDate(data.add_time),
      pipedriveUpdateTime: parseDate(data.update_time),
      visibleTo: data.visible_to,
      ...customFields,
      emails: {
        deleteMany: {},
        ...this.prepareEmailInput(data.emails ?? null),
      },
      phones: {
        deleteMany: {},
        ...this.preparePhoneInput(data.phones ?? null),
      },
      organization: orgUpdate,
      sync_status: 'synced',
    };
  }
}
