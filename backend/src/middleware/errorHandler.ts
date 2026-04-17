import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

/**
 * Centralized error handler.
 * Handles: AppError, Zod errors, Mongoose errors, JWT errors, and unknown errors.
 * Returns structured JSON responses matching the ApiErrorResponse shape.
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    // ── AppError (our custom operational errors) ──
    if (err instanceof AppError) {
        if (!err.isOperational) {
            logger.error('Non-operational error:', { message: err.message, stack: err.stack });
        }
        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                ...(err.details && { details: err.details }),
            },
        });
        return;
    }

    // ── Mongoose Validation Error ──
    if (err.name === 'ValidationError') {
        const details = Object.values((err as any).errors || {}).map((e: any) => ({
            field: e.path,
            message: e.message,
        }));
        res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details,
            },
        });
        return;
    }

    // ── Mongoose CastError (invalid ObjectId, etc.) ──
    if (err.name === 'CastError') {
        res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_ID',
                message: 'Invalid ID format',
            },
        });
        return;
    }

    // ── MongoDB Duplicate Key ──
    if ((err as any).code === 11000) {
        const field = Object.keys((err as any).keyValue || {})[0] || 'field';
        res.status(409).json({
            success: false,
            error: {
                code: 'DUPLICATE_ENTRY',
                message: `Duplicate entry. A record with this ${field} already exists.`,
            },
        });
        return;
    }

    // ── JWT Errors ──
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'Invalid authentication token',
            },
        });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            error: {
                code: 'TOKEN_EXPIRED',
                message: 'Authentication token has expired',
            },
        });
        return;
    }

    // ── Multer file upload errors ──
    if (err.message?.includes('Only PDF') || err.message?.includes('Only')) {
        res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_FILE',
                message: err.message,
            },
        });
        return;
    }

    // ── Unknown / Unhandled error ──
    logger.error('Unhandled error:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
    });

    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: process.env.NODE_ENV === 'production'
                ? 'Internal server error'
                : err.message,
        },
    });
};
