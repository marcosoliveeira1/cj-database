import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prismaClient';
import { PipedriveData } from '@src/webhooks/processing/strategies/base-upsert.strategy';
import { CustomFieldMappingService } from '@src/webhooks/custom-fields/custom-field-mapping.service';
import {
  parseDate,
  safeParseInt,
} from '@src/common/mapping/utils/mapping.utils';
import { IMapper } from '@src/common/mapping/interfaces/mapper.interface';
import {
  EmailInput,
  PersonInput,
  PhoneInput,
} from '@src/webhooks/dtos/pipedrive.dto';

@Injectable()
export class PersonMapper
  implements
    IMapper<PipedriveData, Prisma.PersonCreateInput, Prisma.PersonUpdateInput>
{
  private readonly logger = new Logger(PersonMapper.name);

  constructor(private readonly customFieldMapper: CustomFieldMappingService) {}

  private mapCustomFields(
    customFieldsData: Record<string, any> | null | undefined,
  ): Record<string, any> {
    const mappedFields: Record<string, any> = {};
    if (!customFieldsData) return mappedFields;

    const mapping = this.customFieldMapper.getMappingFor('person');

    for (const [pipedriveKey, value] of Object.entries(customFieldsData)) {
      const mapInfo = mapping[pipedriveKey];
      if (mapInfo) {
        const { prismaField, type } = mapInfo;
        let preparedValue: unknown = value;

        if (value !== null && value !== undefined) {
          if (type === 'date' || type === 'datetime' || type === 'time') {
            preparedValue = parseDate(value as string);
          } else if (type === 'set') {
            if (!Array.isArray(value)) {
              this.logger.warn(
                `Expected array for set field '${prismaField}', received ${typeof value}. Storing raw.`,
              );
            }
            preparedValue = value;
          } else if (type === 'enum') {
            preparedValue = value;
          } else if (type === 'int') {
            preparedValue = safeParseInt(value);
          } else if (type === 'double' || type === 'monetary') {
            preparedValue =
              typeof value === 'string' ? parseFloat(value) : value;
            if (isNaN(preparedValue as number)) preparedValue = null;
          } else if (type === 'address') {
            preparedValue =
              typeof value === 'object' && value !== null
                ? (value as Record<string, unknown>).formatted_address ||
                  JSON.stringify(value)
                : value;
          } else if (type === 'varchar') {
            preparedValue = (value as Record<string, unknown>)?.value || value;
          }
        }
        mappedFields[prismaField] = preparedValue;
      }
    }
    return mappedFields;
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

  toCreateInput(data: PersonInput): Prisma.PersonCreateInput {
    const customFields = this.mapCustomFields(data.custom_fields);

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
      emails: this.prepareEmailInput(data.emails),
      phones: this.preparePhoneInput(data.phones),
      organization: data.org_id ? { connect: { id: data.org_id } } : undefined,
    };
  }

  toUpdateInput(data: PersonInput): Prisma.PersonUpdateInput {
    const customFields = this.mapCustomFields(data.custom_fields);

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
      emails: { deleteMany: {}, ...this.prepareEmailInput(data.emails) },
      phones: { deleteMany: {}, ...this.preparePhoneInput(data.phones) },
      organization: orgUpdate,
    };
  }
}
