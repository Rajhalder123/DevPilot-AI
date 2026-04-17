import winston from 'winston';

const { combine, timestamp, printf, colorize, json } = winston.format;

/** Human-readable format for development */
const devFormat = combine(
    colorize({ all: true }),
    timestamp({ format: 'HH:mm:ss' }),
    printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} ${level}: ${message}${metaStr}`;
    })
);

/** Structured JSON format for production */
const prodFormat = combine(
    timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    json()
);

const isProduction = process.env.NODE_ENV === 'production';

export const logger = winston.createLogger({
    level: isProduction ? 'info' : 'debug',
    format: isProduction ? prodFormat : devFormat,
    defaultMeta: { service: 'devpilot-api' },
    transports: [
        new winston.transports.Console(),
    ],
    // Don't exit on uncaught exceptions — let the process manager handle restarts
    exitOnError: false,
});
