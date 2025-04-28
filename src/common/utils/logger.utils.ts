import { Logger } from '@nestjs/common';

export const logError = (message: string, error: unknown) => {
  if (error instanceof Error) {
    Logger.error(`${message}: ${error.message}`, error.stack);
    return;
  }
  Logger.error(`${message}`, error);
};
