import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

const lokiHost = process.env.LOKI_URL ?? '';
const lokiAuth = `${process.env.LOKI_USERNAME}:${process.env.LOKI_PASSWORD}`;

export const winstonLoggerOptions: winston.LoggerOptions = {
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.json(),
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('App', {
          prettyPrint: true,
        }),
      ),
    }),
    new LokiTransport({
      host: lokiHost,
      basicAuth: lokiAuth,
      labels: { job: 'nestjs-app' },
      json: true,
      replaceTimestamp: true,
    }),
  ],
};
