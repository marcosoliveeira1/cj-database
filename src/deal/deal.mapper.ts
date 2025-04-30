import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prismaClient';
import { CustomFieldMappingService } from '@src/webhooks/custom-fields/custom-field-mapping.service';
import {
  parseDate,
  safeParseInt,
  safeParseFloat,
} from '@src/common/mapping/utils/mapping.utils';
import { IMapper } from '@src/common/mapping/interfaces/mapper.interface';
import { DealInput } from '@src/webhooks/dtos/pipedrive.dto';

@Injectable()
export class DealMapper
  implements IMapper<DealInput, Prisma.DealCreateInput, Prisma.DealUpdateInput>
{
  private readonly logger = new Logger(DealMapper.name);

  constructor(private readonly customFieldMapper: CustomFieldMappingService) {}

  private mapFields(data: DealInput): Record<string, any> {
    const mapped: Record<string, any> = {
      title: data.title,
      value: safeParseFloat(data.value),
      currency: data.currency,
      ownerId: data.owner_id,
      stageId: data.stage_id,
      status: data.status,
      lostReason: data.lost_reason,
      expectedCloseDate: parseDate(data.expected_close_date),
      probability: data.probability,
      pipelineId: data.pipeline_id,
      wonTime: parseDate(data.won_time),
      lostTime: parseDate(data.lost_time),
      closeTime: parseDate(data.close_time),
      stageChangeTime: parseDate(data.stage_change_time),
      pipedriveAddTime: parseDate(data.add_time),
      pipedriveUpdateTime: parseDate(data.update_time),
      nextActivityDate: parseDate(data.next_activity_date),
      lastActivityDate: parseDate(data.last_activity_date),
      visibleTo: data.visible_to,
      activitiesCount: data.activities_count,
      doneActivitiesCount: data.done_activities_count,
      undoneActivitiesCount: data.undone_activities_count,
      emailMessagesCount: data.email_messages_count,
      weightedValue: safeParseFloat(data.weighted_value),
      weightedValueCurrency: data.weighted_value_currency,
      origin: data.origin,
      originId: data.origin_id,
      channelId: data.channel_id,
      isArchived: data.is_archived,
      archiveTime: parseDate(data.archive_time),
      creatorUserId: data.creator_user_id,
      labelIds: data.label_ids?.join(','),
    };

    if (data.custom_fields) {
      const customFieldMapping = this.customFieldMapper.getMappingFor('deal');
      for (const [pipedriveKey, value] of Object.entries(data.custom_fields)) {
        const mapInfo = customFieldMapping[pipedriveKey];
        if (mapInfo) {
          const { prismaField, type } = mapInfo;
          let preparedValue: unknown = value;

          if (value !== null && value !== undefined) {
            // Use similar type handling logic as in PersonMapper
            if (type === 'date' || type === 'datetime' || type === 'time') {
              preparedValue = parseDate(value as string);
            } else if (
              type === 'int' ||
              type === 'user' ||
              type === 'stage' ||
              type === 'pipeline'
            ) {
              // Treat user/stage/pipeline as int for ID storage
              preparedValue = safeParseInt(value);
            } else if (
              type === 'enum' ||
              type === 'set' ||
              type === 'visible_to'
            ) {
              // Store the string value (or potentially ID for single-option enums)
              // If 'value' is an object like { id: number, label: string }, extract id or label as needed.
              // Pipedrive often sends enum/set values as their ID.
              if (
                typeof value === 'object' &&
                value !== null &&
                'id' in value
              ) {
                preparedValue = String((value as { id: number | string }).id); // Store ID as string
              } else if (Array.isArray(value)) {
                // For 'set' type, join the IDs/values if it's an array of objects or primitives
                preparedValue = value
                  .map((item) =>
                    typeof item === 'object' && item !== null && 'id' in item
                      ? String((item as { id: number }).id)
                      : String(item),
                  )
                  .join(',');
              } else {
                preparedValue = value !== null ? String(value) : null; // Ensure string storage for single enums/other types
              }
            } else if (type === 'double' || type === 'monetary') {
              preparedValue = safeParseFloat(value);
            } else if (
              type === 'text' ||
              type === 'varchar' ||
              type === 'varchar_options'
            ) {
              // Handle potential objects like { value: 'actual text' }
              if (
                typeof value === 'object' &&
                value !== null &&
                'value' in value
              ) {
                preparedValue = (value as { value: string }).value;
              } else {
                preparedValue = value !== null ? String(value) : null;
              }
            } else {
              // Default case: store as is (or convert to string)
              preparedValue = value !== null ? String(value) : null;
            }
          }
          mapped[prismaField] = preparedValue;
        }
        // else {
        //    this.logger.warn(`No mapping found for Deal custom field hash: ${pipedriveKey}`);
        // }
      }
    }

    // Remove undefined properties to avoid Prisma errors on update
    Object.keys(mapped).forEach(
      (key) => mapped[key] === undefined && delete mapped[key],
    );

    return mapped;
  }

  toCreateInput(data: DealInput): Prisma.DealCreateInput {
    const mappedFields = this.mapFields(data);

    const createInput: Prisma.DealCreateInput = {
      id: data.id, // ID is required for create via upsert logic
      ...mappedFields,
      // Connect relationships
      organization: data.org_id ? { connect: { id: data.org_id } } : undefined,
      person: data.person_id ? { connect: { id: data.person_id } } : undefined,
    };

    return createInput;
  }

  toUpdateInput(data: DealInput): Prisma.DealUpdateInput {
    const mappedFields = this.mapFields(data);

    // Handle relationship updates
    let orgUpdate:
      | Prisma.OrganizationUpdateOneWithoutDealsNestedInput
      | undefined;
    if ('org_id' in data) {
      // Check if org_id was explicitly provided in the update payload
      orgUpdate =
        data.org_id === null
          ? { disconnect: true }
          : { connect: { id: data.org_id } };
    }

    let personUpdate: Prisma.PersonUpdateOneWithoutDealsNestedInput | undefined;
    if ('person_id' in data) {
      // Check if person_id was explicitly provided
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
