import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from '@src/config/env.schema';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  private readonly logger = new Logger(BasicStrategy.name);

  constructor(private readonly configService: ConfigService<EnvSchema>) {
    super();
  }

  public validate = (username: string, pass: string): boolean => {
    const expectedUser = this.configService.get('PIPEDRIVE_WEBHOOK_USER', {
      infer: true,
    });
    const expectedPassword = this.configService.get(
      'PIPEDRIVE_WEBHOOK_PASSWORD',
      { infer: true },
    );

    this.logger.debug(`Validating Basic Auth: received user '${username}'`);

    if (expectedUser === username && expectedPassword === pass) {
      this.logger.log('Basic Authentication successful for Pipedrive webhook.');

      return true;
    } else {
      this.logger.warn(`Basic Authentication failed for user '${username}'.`);
      throw new UnauthorizedException('Invalid credentials');
    }
  };
}
