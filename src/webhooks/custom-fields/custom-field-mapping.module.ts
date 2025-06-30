import { Module, Global } from '@nestjs/common';
import { CustomFieldMapperHelper } from './custom-field-mapping.helper';
import { PipedriveApiModule } from '@src/pipedrive-api/pipedrive-api.module';

@Global()
@Module({
  imports: [PipedriveApiModule],
  providers: [CustomFieldMapperHelper],
  exports: [CustomFieldMapperHelper],
})
export class CustomFieldMappingModule {}
