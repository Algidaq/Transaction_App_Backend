import * as winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};
const winstonFormat = winston.format.combine(
  winston.format.json(),
  winston.format.prettyPrint(),
  winston.format.colorize({ all: true })
);
const logger = winston.createLogger({
  levels,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      dirname: 'logs',
      filename: 'error.log',
      level: 'error',
      format: winstonFormat,
    }),
  ],
  format: winstonFormat,
});
export { logger as Logger };
