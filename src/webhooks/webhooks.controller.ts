import {
  Controller,
  Post,
  Body,
  Logger,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  @Post('pipedrive')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  handlePipedriveWebhook(@Body() payload: any): { status: string } {
    this.logger.log('Received Pipedrive Webhook.');

    this.logger.debug(`Payload Keys: ${Object.keys(payload).join(', ')}`);
    // @TODO: implement logic
    return { status: 'received' };
  }
}
