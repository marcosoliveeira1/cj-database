import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  parseDate,
  safeParseFloat,
  safeParseInt,
} from '@src/common/mapping/utils/mapping.utils';
import { PipedriveApiService } from '@src/pipedrive-api/pipedrive-api.service';
import {
  CustomFieldMappingType,
  dealFieldMappings,
  EntityType,
  organizationFieldMappings,
  personFieldMappings,
} from './custom-field.mappings';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from '@src/config/env.schema';

type OptionsMap = Record<string, { id: number; label: string }[]>;

@Injectable()
export class CustomFieldMapperHelper {
  private readonly logger = new Logger(CustomFieldMapperHelper.name);
  private readonly mappings: Record<EntityType, CustomFieldMappingType>;
  private readonly cacheTtl: number;

  constructor(
    private readonly pipedriveApi: PipedriveApiService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    configService: ConfigService<EnvSchema>,
  ) {
    this.cacheTtl =
      (configService.get('CACHE_TTL_SECONDS', { infer: true }) as number) *
      1000;
    this.mappings = {
      deal: dealFieldMappings,
      person: personFieldMappings,
      organization: organizationFieldMappings,
    };
  }

  /**
   * Gets the enum options map, ensuring it's up-to-date.
   * If the cache exists but is missing keys from the payload, it triggers a refresh.
   */
  private async getRefreshedEnumOptionsMap(
    entityType: EntityType,
    customFieldsData: Record<string, any>,
    staticMapping: Record<
      string,
      { prismaField: string; pipedriveType: string }
    >,
  ): Promise<OptionsMap> {
    const cacheKey = `pipedrive-enum-options:${entityType}`;
    let enumOptionsMap = await this.cache.get<OptionsMap>(cacheKey);

    if (enumOptionsMap) {
      this.logger.debug(`Cache HIT for enum options map: ${entityType}`);
      // Check if the cached map is stale
      const missingKeys = Object.keys(customFieldsData).filter((key) => {
        const mapInfo = staticMapping[key];
        const isEnumOrSet =
          mapInfo &&
          (mapInfo.pipedriveType === 'enum' || mapInfo.pipedriveType === 'set');
        return isEnumOrSet && !enumOptionsMap![key];
      });

      if (missingKeys.length > 0) {
        this.logger.warn(
          `Cached enum map for ${entityType} is stale. Missing keys: ${missingKeys.join(', ')}. Forcing refresh.`,
        );
        enumOptionsMap = await this.fetchAndCacheEnumOptions(entityType);
      }
    } else {
      this.logger.debug(`Cache MISS for enum options map: ${entityType}`);
      enumOptionsMap = await this.fetchAndCacheEnumOptions(entityType);
    }

    return enumOptionsMap;
  }

  /**
   * Fetches all fields from Pipedrive API, builds the options map, and caches it.
   */
  private async fetchAndCacheEnumOptions(
    entityType: EntityType,
  ): Promise<OptionsMap> {
    const cacheKey = `pipedrive-enum-options:${entityType}`;
    const allFields = await this.pipedriveApi.getAllFields(entityType);
    const newMap: OptionsMap = {};

    for (const field of allFields) {
      if (
        (field.field_type === 'enum' || field.field_type === 'set') &&
        field.options
      ) {
        newMap[field.key] = field.options;
      }
    }

    await this.cache.set(cacheKey, newMap, this.cacheTtl);
    this.logger.log(`Refreshed and cached enum options map for ${entityType}.`);
    return newMap;
  }

  async mapCustomFieldsToInput<T extends Record<string, any>>(
    entityType: EntityType,
    data: Record<string, any> | null | undefined,
  ): Promise<Partial<T>> {
    const customFieldsData = data?.custom_fields as Record<string, any>;
    const mappedFields: Partial<T> = {};

    if (!customFieldsData) {
      return mappedFields;
    }

    const entityMappings = this.mappings[entityType];
    if (!entityMappings) {
      this.logger.warn(`No mappings defined for entity type: ${entityType}`);
      return {};
    }

    const enumOptionsMap = await this.getRefreshedEnumOptionsMap(
      entityType,
      customFieldsData,
      entityMappings,
    );

    for (const pipedriveHash in customFieldsData) {
      if (Object.prototype.hasOwnProperty.call(entityMappings, pipedriveHash)) {
        const mapping = entityMappings[pipedriveHash];
        const { prismaField, pipedriveType } = mapping;
        const value = customFieldsData[pipedriveHash] as Record<string, any>;

        if (value !== undefined && value !== null) {
          const preparedValue = this.prepareValueBasedOnType(
            value,
            pipedriveType,
            enumOptionsMap[pipedriveHash],
          );
          (mappedFields as Record<string, any>)[prismaField] = preparedValue;
        }
      }
    }

    return mappedFields;
  }

  private prepareValueBasedOnType(
    value: any,
    type: string,
    enumOptions?: { id: number; label: string }[],
  ): unknown {
    if (value === null || value === undefined) return null;

    switch (type) {
      case 'date':
      case 'datetime':
      case 'time':
        return typeof value === 'object' && value !== null && 'value' in value
          ? parseDate((value as { value?: string })?.value)?.toISOString()
          : parseDate(value)?.toISOString();
      case 'int':
      case 'user':
      case 'stage':
      case 'pipeline':
        return typeof value === 'object' && value !== null && 'id' in value
          ? safeParseInt((value as { id: number }).id)
          : safeParseInt(value);
      case 'double':
      case 'monetary':
        return safeParseFloat(value);
      case 'enum': {
        const valueId =
          typeof value === 'object' && value !== null && 'id' in value
            ? (value as { id: number }).id
            : String(value);
        if (!enumOptions) {
          this.logger.warn(
            `No enum options found for a field of type '${type}'. Returning raw ID: ${valueId}`,
          );
          return String(valueId);
        }
        const foundOption = enumOptions.find((opt) => opt.id == valueId);
        if (!foundOption) {
          this.logger.warn(
            `Option with ID '${valueId}' not found in enum map. Returning raw ID.`,
          );
          return String(valueId);
        }
        return foundOption.label;
      }
      case 'set': {
        if (
          value !== null &&
          typeof value === 'object' &&
          Array.isArray(value)
        ) {
          return value
            .map((item: any) => {
              const foundOption = enumOptions?.find((opt) => opt.id == item);
              if (!foundOption) {
                this.logger.warn(
                  `Option with ID '${item}' not found in 'set' options. Returning raw ID.`,
                );
                return String(item);
              }
              return foundOption.label;
            })
            .filter((label: string | null): label is string => label !== null)
            .join(', ');
        }

        if (
          typeof value !== 'object' ||
          value === null ||
          !Array.isArray(value.values)
        ) {
          this.logger.warn(
            `Unexpected structure for 'set' type field. Expected { values: [] }, got: ${JSON.stringify(value)}`,
          );
          return null;
        }

        const labels = value.values
          .map((item: any) => {
            const itemId = item?.id;
            if (itemId === undefined) return null;

            if (!enumOptions) {
              this.logger.warn(
                `No enum options available for 'set' type field. Returning raw ID: ${itemId}`,
              );
              return String(itemId);
            }

            const foundOption = enumOptions.find((opt) => opt.id == itemId);
            if (!foundOption) {
              this.logger.warn(
                `Option with ID '${itemId}' not found in 'set' options. Returning raw ID.`,
              );
              return String(itemId);
            }
            return foundOption.label;
          })
          .filter((label: string | null): label is string => label !== null);

        return labels.join(', ');
      }
      case 'visible_to':
        if (typeof value === 'object' && value !== null && 'id' in value) {
          return String((value as { id: number | string }).id);
        } else if (Array.isArray(value)) {
          return value
            .map((item) =>
              String((item as { id: number | string })?.id ?? item),
            )
            .join(',');
        }
        return String(value);
      case 'address':
        return typeof value === 'object' && value !== null
          ? (value as { formatted_address?: string }).formatted_address ||
              JSON.stringify(value)
          : String(value);
      case 'text':
      case 'varchar':
      case 'varchar_auto': // Pipedrive API sometimes returns this for text fields
        return typeof value === 'object' && value !== null && 'value' in value
          ? String((value as { value?: string }).value)
          : String(value);
      default:
        return String(value);
    }
  }
}
