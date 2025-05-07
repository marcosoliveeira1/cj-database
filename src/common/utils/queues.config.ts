import { QueueOptions } from 'bullmq';

export const DEFAULT_JOB_OPTIONS: QueueOptions['defaultJobOptions'] = {
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
};