import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Prisma } from '@prismaClient';
import { IOrganizationRepository } from '@src/organization/interfaces/organization-repository.interface';
import { IPersonRepository } from '@src/person/interfaces/person-repository.interface';
import {
    EntitySyncJobName,
    EntitySyncJobPayload,
    ENTITY_SYNC_QUEUE_TOKEN,
    ManagedEntityType,
} from '@src/common/utils/queues.types';
import { IRepository } from '@src/common/respository/interfaces/repository.interface';

@Injectable()
export class RelatedEntityEnsureService {
    private readonly logger = new Logger(RelatedEntityEnsureService.name);

    constructor(
        @Inject(IOrganizationRepository) private readonly orgRepository: IOrganizationRepository,
        @Inject(IPersonRepository) private readonly personRepository: IPersonRepository,
        @InjectQueue(ENTITY_SYNC_QUEUE_TOKEN)
        private readonly entitySyncQueue: Queue<EntitySyncJobPayload, any, EntitySyncJobName>,
    ) { }

    async ensureExists(
        entityType: ManagedEntityType,
        entityId: number | null | undefined,
    ): Promise<void> {
        if (!entityId) {
            this.logger.debug(`Skipping ensureExists for ${entityType}: entityId is null or undefined.`);
            return;
        }

        const repository = this.getRepository(entityType);

        try {
            const entityExists = await repository.findById(entityId);
            if (entityExists) {
                this.logger.debug(`Entity ${entityType} ID ${entityId} already exists. No action needed.`);
                return;
            }
        } catch (error) {
            this.logger.warn(
                `Error checking existence for ${entityType} ID ${entityId}, assuming it doesn't exist. Error: ${error}`,
            );
        }

        this.logger.log(`Entity ${entityType} ID ${entityId} not found. Creating placeholder and queueing for sync.`);
        try {
            await repository.createPlaceholder({ id: entityId });
            const jobName = this.getJobName(entityType);
            await this.entitySyncQueue.add(jobName, { entityType, entityId }, {
                jobId: `sync-${entityType}-${entityId}-${Date.now()}`,
            });
            this.logger.log(`Successfully queued ${entityType} ID ${entityId} for sync job '${jobName}'.`);
        } catch (creationError) {
            if (creationError instanceof Prisma.PrismaClientKnownRequestError && creationError.code === 'P2002') {
                this.logger.warn(
                    `Placeholder for ${entityType} ID ${entityId} likely created concurrently (P2002). Sync job might already be queued or will be picked up.`,
                );
            } else {
                this.logger.error(
                    `Failed to create placeholder or queue sync for ${entityType} ID ${entityId}: ${creationError}`,
                );
                throw creationError;
            }
        }
    }

    private getRepository(
        entityType: ManagedEntityType,
    ): IRepository<any, any, any, any> {
        if (entityType === 'organization') {
            return this.orgRepository;
        } else if (entityType === 'person') {
            return this.personRepository;
        }
        throw new Error(`Invalid managed entity type for repository: ${entityType}`);
    }

    private getJobName(entityType: ManagedEntityType): EntitySyncJobName {
        if (entityType === 'organization') {
            return EntitySyncJobName.SYNC_ORGANIZATION;
        } else if (entityType === 'person') {
            return EntitySyncJobName.SYNC_PERSON;
        }
        throw new Error(`Invalid managed entity type for job name: ${entityType}`);
    }
}