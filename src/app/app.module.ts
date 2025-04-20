import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from '../config/validate-env';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhooksModule } from 'src/webhooks/webhooks.module';
import { WebhooksController } from 'src/webhooks/webhooks.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    WebhooksModule,
  ],
  controllers: [AppController, WebhooksController],
  providers: [AppService],
})
export class AppModule {}
