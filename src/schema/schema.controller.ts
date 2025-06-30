import {
  Controller,
  Get,
  Param,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { SchemaService } from './schema.service';
import { SchemaFieldResponseDto, MappedEntityType } from './dto/schema.dto';

@Controller('schema')
export class SchemaController {
  private readonly logger = new Logger(SchemaController.name);

  constructor(private readonly schemaService: SchemaService) {}

  @Get(':entityType')
  async getSchema(
    @Param('entityType') entityType: string,
  ): Promise<SchemaFieldResponseDto[]> {
    this.logger.log(`Received request for schema of entity: ${entityType}`);

    if (!['deal', 'person', 'organization'].includes(entityType)) {
      this.logger.warn(`Invalid entity type requested: ${entityType}`);
      throw new BadRequestException(
        "Invalid entity type. Must be one of 'deal', 'person', or 'organization'.",
      );
    }

    return this.schemaService.getSchemaForEntity(
      entityType as MappedEntityType,
    );
  }
}
