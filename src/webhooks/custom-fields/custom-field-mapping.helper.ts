import { Injectable, Logger, } from "@nestjs/common";
import { CustomFieldMappingService } from "./custom-field-mapping.service";
import { parseDate, safeParseFloat, safeParseInt } from "@src/common/mapping/utils/mapping.utils";

@Injectable()
export class CustomFieldMapperHelper {
  private readonly logger = new Logger(CustomFieldMapperHelper.name);

  constructor(private readonly mappingService: CustomFieldMappingService) { }

  mapCustomFieldsToInput<T extends Record<string, any>>(
    entityType: 'person' | 'organization' | 'deal',
    customFieldsData: Record<string, any> | null | undefined
  ): Partial<T> {
    const mappedFields: Partial<T> = {};
    if (!customFieldsData) return mappedFields;

    const mapping = this.mappingService.getMappingFor(entityType);

    for (const [pipedriveKey, value] of Object.entries(customFieldsData)) {
      const mapInfo = mapping[pipedriveKey];
      if (mapInfo) {
        const { prismaField, type } = mapInfo;
        const preparedValue = this.prepareValueBasedOnType(value, type, prismaField);
        // @ts-ignore
        mappedFields[prismaField as keyof T] = preparedValue;
      } else {
        if(pipedriveKey === "im") continue;
        this.logger.debug(`No mapping found for ${entityType} custom field hash: ${pipedriveKey}`);
      }
    }
    return mappedFields;
  }

  private prepareValueBasedOnType(value: any, type: string, fieldName: string): unknown {
    if (value === null || value === undefined) return null;

    switch (type) {
      case 'date':
      case 'datetime':
      case 'time':
        return parseDate(value as string);
      case 'int':
      case 'user':
      case 'stage':
      case 'pipeline':
        return safeParseInt(value);
      case 'double':
      case 'monetary':
        return safeParseFloat(value);
      case 'enum':
      case 'set':
      case 'visible_to':
        if (typeof value === 'object' && value !== null && 'id' in value) {
          return String((value as { id: number | string }).id);
        } else if (Array.isArray(value)) {
          return value.map(item => String(item?.id ?? item)).join(',');
        }
        return String(value);
      case 'address':
        return typeof value === 'object' && value !== null
          ? (value as any).formatted_address || JSON.stringify(value)
          : String(value);
      case 'text':
      case 'varchar':
        return String(value);
      default:
        return String(value);
    }
  }
}
