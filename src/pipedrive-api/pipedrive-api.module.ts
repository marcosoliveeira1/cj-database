import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PipedriveApiService } from './pipedrive-api.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [PipedriveApiService],
  exports: [PipedriveApiService],
})
export class PipedriveApiModule {}
