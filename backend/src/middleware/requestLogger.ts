import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Structured request logging middleware.
 * Logs: method, path, status code, response time, user ID (if authenticated).
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Hook into response finish event
    res.on('finish', () => {
        const duration = Date.now() - start;
        const userId = (req as any).user?._id?.toString();

        const logData = {
            method: req.method,
            path: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            ...(userId && { userId }),
        };

        if (res.statusCode >= 500) {
            logger.error('Request failed', logData);
        } else if (res.statusCode >= 400) {
            logger.warn('Client error', logData);
        } else {
            logger.info('Request completed', logData);
        }
    });

    next();
};
