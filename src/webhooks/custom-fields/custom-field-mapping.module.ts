import { Module, Global } from '@nestjs/common';
import { CustomFieldMappingService } from './custom-field-mapping.service';
import { CustomFieldMapperHelper } from './custom-field-mapping.helper';
import { PipedriveApiModule } from '@src/pipedrive-api/pipedrive-api.module';

@Global()
@Module({
  imports: [PipedriveApiModule],
  providers: [CustomFieldMappingService, CustomFieldMapperHelper],
  exports: [CustomFieldMappingService, CustomFieldMapperHelper],
})
export class CustomFieldMappingModule {}
