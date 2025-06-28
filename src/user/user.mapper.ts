import { Injectable } from '@nestjs/common';
import { Prisma } from '@prismaClient';
import { parseDate } from '@src/common/mapping/utils/mapping.utils';
import { IMapper } from '@src/common/mapping/interfaces/mapper.interface';
import { UserInput } from '@src/webhooks/dtos/pipedrive.dto';

@Injectable()
export class UserMapper
  implements IMapper<UserInput, Prisma.UserCreateInput, Prisma.UserUpdateInput>
{
  toCreateInput(data: UserInput): Prisma.UserCreateInput {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      activeFlag: data.active_flag,
      iconUrl: data.icon_url,
      lastLogin: parseDate(data.last_login),
      pipedriveCreated: parseDate(data.created),
      pipedriveModified: parseDate(data.modified),
    };
  }

  toUpdateInput(data: UserInput): Prisma.UserUpdateInput {
    return {
      name: data.name,
      email: data.email,
      phone: data.phone,
      activeFlag: data.active_flag,
      iconUrl: data.icon_url,
      lastLogin: parseDate(data.last_login),
      pipedriveModified: parseDate(data.modified),
      sync_status: 'synced',
    };
  }
}