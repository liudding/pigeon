const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');
const config = require('../configs');


const stringFormat = winston.format.printf(({timestamp, label, level, message, durationMs, ...args}) => {
    return `${timestamp} [${label}] ${level}: ${message} ${durationMs ? `profiling (${durationMs}ms)` : ''}`;
  });

function createLogger(label) {
    label = path.basename(label);

    const logDir = config.logDir;

    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.label({ label: label }),
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.simple(),
            stringFormat
          ),
        transports: [
            new winston.transports.DailyRotateFile({
                filename: logDir + `/${config.appName}-%DATE%.log`,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '2m',
                maxFiles: '14d'
            }),
            new winston.transports.DailyRotateFile({
                filename: logDir + `/${config.appName}-error-%DATE%.log`,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '10m',
                maxFiles: '14d',
                level: 'error'
            }),
            config.env !== 'production' ? new winston.transports.Console({
                colorize: true,
                label: label,
                timestamp: true,
              }) : undefined
        ],
    });
    
}

module.exports = { createLogger};