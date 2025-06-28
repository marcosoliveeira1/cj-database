import { Injectable, Inject } from '@nestjs/common';
import { UserMapper } from '@src/user/user.mapper';
import { IUserRepository } from '@src/user/interfaces/user-repository.interface';
import { UserInput } from '@src/webhooks/dtos/pipedrive.dto';
import { Prisma, User } from '@prismaClient';
import { BaseUpsertStrategy } from './base-upsert.strategy';

@Injectable()
export class UserUpsertStrategy extends BaseUpsertStrategy<
  User,
  UserInput,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserWhereUniqueInput
> {
  constructor(
    @Inject(IUserRepository) repository: IUserRepository,
    @Inject(UserMapper) mapper: UserMapper,
  ) {
    super(mapper, repository, 'user');
  }
}
