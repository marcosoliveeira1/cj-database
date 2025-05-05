import { Module, Global } from '@nestjs/common';
import { CustomFieldMappingService } from './custom-field-mapping.service';
import { CustomFieldMapperHelper } from './custom-field-mapping.helper';

@Global()
@Module({
  providers: [CustomFieldMappingService, CustomFieldMapperHelper],
  exports: [CustomFieldMappingService, CustomFieldMapperHelper],
})
export class CustomFieldMappingModule {}
