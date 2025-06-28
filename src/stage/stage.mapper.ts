import { Injectable } from '@nestjs/common';
import { Prisma } from '@prismaClient';
import { parseDate } from '@src/common/mapping/utils/mapping.utils';
import { IMapper } from '@src/common/mapping/interfaces/mapper.interface';
import { StageInput } from '@src/webhooks/dtos/pipedrive.dto';

@Injectable()
export class StageMapper
  implements
    IMapper<StageInput, Prisma.StageCreateInput, Prisma.StageUpdateInput>
{
  toCreateInput(data: StageInput): Prisma.StageCreateInput {
    return {
      id: data.id,
      name: data.name,
      orderNr: data.order_nr,
      activeFlag: data.active_flag,
      dealProbability: data.deal_probability,
      rottenFlag: data.rotten_flag,
      rottenDays: data.rotten_days,
      pipedriveAddTime: parseDate(data.add_time),
      pipedriveUpdateTime: parseDate(data.update_time),
      pipelineId: data.pipeline_id,
    };
  }

  toUpdateInput(data: StageInput): Prisma.StageUpdateInput {
    return {
      name: data.name,
      orderNr: data.order_nr,
      activeFlag: data.active_flag,
      dealProbability: data.deal_probability,
      rottenFlag: data.rotten_flag,
      rottenDays: data.rotten_days,
      pipedriveUpdateTime: parseDate(data.update_time),
      pipelineId: data.pipeline_id,
      sync_status: 'synced',
    };
  }
}
