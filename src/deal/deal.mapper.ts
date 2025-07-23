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
  private async mapCustomFields(
    data: DealInput,
  ): Promise<Partial<Prisma.DealCreateInput>> {
    return await this.customFieldMapperHelper.mapCustomFieldsToInput(
      'deal',
      data,
    );
  }

  async toCreateInput(data: DealInput): Promise<Prisma.DealCreateInput> {
    const mappedFields = await this.mapCustomFields(data);

    let organizationConnect:
      | Prisma.OrganizationCreateNestedOneWithoutDealsInput
      | undefined;
    if (data.org_id && data.org_id > 0) {
      organizationConnect = { connect: { id: data.org_id } };
    } else if (data.org_id !== undefined && data.org_id !== null) {
      this.logger.warn(
        `Invalid org_id (${data.org_id}) provided for new Deal ID ${data.id}. Ignoring organization association.`,
      );
    }

    let personConnect:
      | Prisma.PersonCreateNestedOneWithoutDealsInput
      | undefined;
    if (data.person_id && data.person_id > 0) {
      personConnect = { connect: { id: data.person_id } };
    } else if (data.person_id !== undefined && data.person_id !== null) {
      this.logger.warn(
        `Invalid person_id (${data.person_id}) provided for new Deal ID ${data.id}. Ignoring person association.`,
      );
    }

    const createInput: Prisma.DealCreateInput = {
      ...this.baseInput(data),
      ...mappedFields,
      organization: organizationConnect,
      person: personConnect,
    };

    return createInput;
  }

  async toUpdateInput(data: DealInput): Promise<Prisma.DealUpdateInput> {
    const mappedFields = await this.mapCustomFields(data);

    let orgUpdate:
      | Prisma.OrganizationUpdateOneWithoutDealsNestedInput
      | undefined;
    if ('org_id' in data) {
      if (data.org_id && data.org_id > 0) {
        orgUpdate = { connect: { id: data.org_id } };
      } else if (data.org_id === null) {
        orgUpdate = { disconnect: true };
      } else {
        this.logger.warn(
          `Invalid org_id (${data.org_id}) received for updating Deal ID ${data.id}. Ignoring organization association change.`,
        );
      }
    }

    let personUpdate: Prisma.PersonUpdateOneWithoutDealsNestedInput | undefined;
    if ('person_id' in data) {
      if (data.person_id && data.person_id > 0) {
        personUpdate = { connect: { id: data.person_id } };
      } else if (data.person_id === null) {
        personUpdate = { disconnect: true };
      } else {
        this.logger.warn(
          `Invalid person_id (${data.person_id}) received for updating Deal ID ${data.id}. Ignoring person association change.`,
        );
      }
    }

    const updateInput: Prisma.DealUpdateInput = {
      ...this.baseInput(data),
      ...mappedFields,
      organization: orgUpdate,
      person: personUpdate,
    };

    return updateInput;
  }

  private baseInput(data: DealInput) {
    return {
      id: data.id,
      title: data.title,
      status: data.status,
      creatorUserId: data.creator_user_id,
      pipedriveAddTime: data.add_time,
      pipedriveUpdateTime: data.update_time,
      ownerId: data.owner_id,
      pipelineId: data.pipeline_id,
      stageId: data.stage_id,
      stageChangeTime: data.stage_change_time,
      nextActivityDate: data.next_activity_date,
      lastActivityDate: data.last_activity_date,
      wonTime: data.won_time,
      lostTime: data.lost_time,
      closeTime: data.close_time,
      lostReason: data.lost_reason,
      visibleTo: data.visible_to,
      activitiesCount: data.activities_count,
      doneActivitiesCount: data.done_activities_count,
      undoneActivitiesCount: data.undone_activities_count,
      emailMessagesCount: data.email_messages_count,
      value: data.value,
      currency: data.currency,
      expectedCloseDate: this.parseDate(data.expected_close_date),
      probability: data.probability,
      labelIds: data.label_ids?.join(','),
      weightedValue: data.weighted_value,
      weightedValueCurrency: data.weighted_value_currency,
      origin: data.origin,
      originId: data.origin_id,
      channelId: data.channel_id,
      isArchived: data.is_archived,
      archiveTime: data.archive_time,
    };
  }

  private parseDate(dateString: string | null | undefined): string | null {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date.toISOString();
    } catch {
      return null;
    }
  }
}
