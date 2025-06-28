import { Module } from '@nestjs/common';
import { UserMapper } from './user.mapper';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { IUserRepository } from './interfaces/user-repository.interface';

@Module({
  providers: [
    UserMapper,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserMapper, IUserRepository],
})
export class UserModule {}