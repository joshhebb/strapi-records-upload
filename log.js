'use strict';
import { createLogger, format, transports } from 'winston';

global.logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.colorize(),
        format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [new transports.Console()]
});