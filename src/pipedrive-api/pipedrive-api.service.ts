import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logError } from '@src/common/utils/logger.utils';
import { EnvSchema } from '@src/config/env.schema';
import {
  OrganizationInput,
  PersonInput,
  PipelineInput,
  StageInput,
} from '@src/webhooks/dtos/pipedrive.dto';
import { firstValueFrom } from 'rxjs';

type PipedriveField = {
  key: string;
  name: string;
  field_type: 'enum' | 'set';
  options?: { id: number; label: string }[];
};

type PipedriveFieldResponse = {
  success: boolean;
  data: PipedriveField[] | null;
};

type PipedriveSingleEntityResponse<T> = {
  success: boolean;
  data: T | null;
};

@Injectable()
export class PipedriveApiService {
  private readonly logger = new Logger(PipedriveApiService.name);
  private readonly baseUrl: string;
  private readonly apiToken: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService<EnvSchema>,
  ) {
    this.baseUrl = configService.get('PIPEDRIVE_API_URL', {
      infer: true,
    }) as string;
    this.apiToken = configService.get('PIPEDRIVE_API_TOKEN', {
      infer: true,
    }) as string;
  }

  async getAllFields(
    entityType: 'deal' | 'person' | 'organization',
  ): Promise<PipedriveField[]> {
    const url = `${this.baseUrl}/v1/${entityType}Fields?api_token=${this.apiToken}`;
    this.logger.log(`Fetching all fields for entity type: ${entityType}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get<PipedriveFieldResponse>(url),
      );

      if (response.data?.success && Array.isArray(response.data.data)) {
        this.logger.log(
          `Successfully fetched ${response.data.data.length} fields for ${entityType}.`,
        );
        return response.data.data;
      }

      this.logger.warn(
        `Pipedrive API did not return a successful response for ${entityType} fields. Response: ${JSON.stringify(response.data)}`,
      );
      return [];
    } catch (error) {
      logError(`Failed to fetch fields for ${entityType}.`, error);
      return [];
    }
  }

  async getPersonById(id: number): Promise<PersonInput | null> {
    return this.getEntityById<PersonInput>('person', id);
  }

  async getOrganizationById(id: number): Promise<OrganizationInput | null> {
    return this.getEntityById<OrganizationInput>('organization', id);
  }

  async getPipelineById(id: number): Promise<PipelineInput | null> {
    return this.getEntityById<PipelineInput>('pipeline', id);
  }

  async getStageById(id: number): Promise<StageInput | null> {
    return this.getEntityById<StageInput>('stage', id);
  }

  private async getEntityById<T>(
    entityType: 'person' | 'organization' | 'pipeline' | 'stage',
    id: number,
    apiVersion: 'v1' | 'v2' = 'v2',
  ): Promise<T | null> {
    const url = `${this.baseUrl}/${apiVersion}/${entityType}s/${id}?api_token=${this.apiToken}`;
    this.logger.log(`Fetching ${entityType} with ID: ${id}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get<PipedriveSingleEntityResponse<T>>(url),
      );

      if (response.data?.success && response.data.data) {
        this.logger.log(`Successfully fetched ${entityType} ID ${id}.`);
        return response.data.data;
      }

      this.logger.warn(
        `Could not find ${entityType} with ID ${id} in Pipedrive. Response: ${JSON.stringify(response.data)}`,
      );
      return null;
    } catch (error) {
      logError(`Failed to fetch ${entityType} with ID ${id}.`, error);
      return null;
    }
  }
}
