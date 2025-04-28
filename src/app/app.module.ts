import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from '@src/config/validate-env';
import { PrismaModule } from '@src/prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhooksModule } from '@src/webhooks/webhooks.module';
import { OrganizationModule } from '@src/organization/organization.module';
import { PersonModule } from '@src/person/person.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    WebhooksModule,
    OrganizationModule,
    PersonModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
