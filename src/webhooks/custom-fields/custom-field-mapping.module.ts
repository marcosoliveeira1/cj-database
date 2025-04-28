import { Module, Global } from '@nestjs/common';
import { CustomFieldMappingService } from './custom-field-mapping.service';

@Global()
@Module({
  providers: [CustomFieldMappingService],
  exports: [CustomFieldMappingService],
})
export class CustomFieldMappingModule {}
