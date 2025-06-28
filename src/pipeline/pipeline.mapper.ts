import { Injectable } from '@nestjs/common';
import { Prisma } from '@prismaClient';
import { parseDate } from '@src/common/mapping/utils/mapping.utils';
import { IMapper } from '@src/common/mapping/interfaces/mapper.interface';
import { PipelineInput } from '@src/webhooks/dtos/pipedrive.dto';

@Injectable()
export class PipelineMapper
  implements
    IMapper<
      PipelineInput,
      Prisma.PipelineCreateInput,
      Prisma.PipelineUpdateInput
    >
{
  toCreateInput(data: PipelineInput): Prisma.PipelineCreateInput {
    return {
      id: data.id,
      name: data.name,
      urlTitle: data.url_title,
      orderNr: data.order_nr,
      activeFlag: data.active_flag,
      dealProbability: data.deal_probability,
      pipedriveAddTime: parseDate(data.add_time),
      pipedriveUpdateTime: parseDate(data.update_time),
    };
  }

  toUpdateInput(data: PipelineInput): Prisma.PipelineUpdateInput {
    return {
      name: data.name,
      urlTitle: data.url_title,
      orderNr: data.order_nr,
      activeFlag: data.active_flag,
      dealProbability: data.deal_probability,
      pipedriveUpdateTime: parseDate(data.update_time),
      sync_status: 'synced',
    };
  }
}
