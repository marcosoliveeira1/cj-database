import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { AuthModule } from '@src/auth/auth.module';
import { WebhookProcessingService } from './processing/webhook-processing.service';
import { PersonUpsertStrategy } from './processing/strategies/person-upsert.strategy';
import { OrganizationUpsertStrategy } from './processing/strategies/organization-upsert.strategy';
import { CustomFieldMappingModule } from './custom-fields/custom-field-mapping.module';
import { PersonModule } from '@src/person/person.module';
import { OrganizationModule } from '@src/organization/organization.module';

@Module({
  imports: [
    AuthModule,
    CustomFieldMappingModule,
    PersonModule,
    OrganizationModule,
  ],
  controllers: [WebhooksController],
  providers: [
    WebhookProcessingService,
    PersonUpsertStrategy,
    OrganizationUpsertStrategy,
  ],
})
export class WebhooksModule {}
