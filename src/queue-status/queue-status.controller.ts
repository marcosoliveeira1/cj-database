import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { QueueStatusService } from './queue-status.service';
import { QueueStatusResponseDto } from './dto/queue-status.dto';
import { BasicAuthGuard } from '@src/auth/guards/basic-auth.guard';

@Controller('queues')
@UseGuards(BasicAuthGuard)
export class QueueStatusController {
  private readonly logger = new Logger(QueueStatusController.name);

  constructor(private readonly queueStatusService: QueueStatusService) {}

  @Get('status')
  async getQueueStatus(): Promise<QueueStatusResponseDto[]> {
    this.logger.log('Request received for queue statuses.');
    return this.queueStatusService.getQueuesStatus();
  }
}
