import { Injectable } from '@nestjs/common';
import { BasePrismaRepository } from '@src/common/respository/base-prisma.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { User, Prisma } from '@prismaClient';
import { IUserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class PrismaUserRepository
  extends BasePrismaRepository<
    User,
    Prisma.UserWhereUniqueInput,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserDelegate
  >
  implements IUserRepository
{
  protected delegate = this.prisma.user;
  protected entityName = 'User';

  constructor(prisma: PrismaService) {
    super(prisma);
  }

  protected getPlaceholderData(id: number): Prisma.UserCreateInput {
    return {
      id,
      name: `Pipedrive User #${id}`,
      sync_status: 'placeholder',
      activeFlag: false,
    };
  }
}
