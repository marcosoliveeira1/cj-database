import { Module, Logger } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WebhooksController],
  providers: [Logger],
})
export class WebhooksModule {}
