import {
  Controller,
  Post,
  Body,
  Logger,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { BasicAuthGuard } from '@src/auth/guards/basic-auth.guard';
import { WebhookProcessingService } from './processing/webhook-processing.service';
import { PipedriveWebhookPayloadDto } from './dtos/pipedrive-webhook.zod';
import { ValidationPipe } from '@nestjs/common';
import { logError } from '@src/common/utils/logger.utils';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly processingService: WebhookProcessingService) { }

  @Post('pipedrive')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  handlePipedriveWebhook(
    @Body() payload: PipedriveWebhookPayloadDto,
  ): { status: string } {
    this.logger.log(
      `Received Pipedrive Webhook for ${payload.meta?.entity} ID ${payload.data?.id ?? 'N/A'}`,
    );

    this.processingService.processWebhook(payload).catch((error) => {
      logError(`Error during async webhook processing`, error);
      return;
    });

    return { status: 'received' };
  }
}
