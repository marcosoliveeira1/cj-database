import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logError } from '@src/common/utils/logger.utils';
import { EnvSchema } from '@src/config/env.schema';
import { firstValueFrom } from 'rxjs';

type PipedriveField = {
  key: string;
  name: string;
  field_type: 'enum' | 'set' | 'varchar';
  options?: { id: number; label: string }[];
};

type PipedriveFieldResponse = {
  success: boolean;
  data: PipedriveField[] | null;
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
    const url = `${this.baseUrl}/${entityType}Fields?api_token=${this.apiToken}`;
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
}
