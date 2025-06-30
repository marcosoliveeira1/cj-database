import { Module } from '@nestjs/common';
import { SchemaController } from './schema.controller';
import { SchemaService } from './schema.service';
import { PipedriveApiModule } from '@src/pipedrive-api/pipedrive-api.module';

@Module({
  imports: [PipedriveApiModule],
  controllers: [SchemaController],
  providers: [SchemaService],
})
export class SchemaModule {}
