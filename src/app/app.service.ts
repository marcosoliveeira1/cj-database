import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    const greenPriority = process.env.GREEN_PRIORITY;
    const bluePriority = process.env.BLUE_PRIORITY;
    this.logger.log(`Green Priority: ${greenPriority}`);
    this.logger.log(`Blue Priority: ${bluePriority}`);
    this.logger.log(`Active Color: ${process.env.APP_COLOR}`);
    return `Active Color: ${process.env.APP_COLOR}, Green Priority: ${greenPriority}, Blue Priority: ${bluePriority}`;
  }
}
