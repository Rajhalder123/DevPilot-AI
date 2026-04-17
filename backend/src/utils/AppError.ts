/**
 * Custom application error class with HTTP status codes.
 * Extends native Error with operational context for the centralized error handler.
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;
    public readonly details?: Record<string, unknown>[];

    constructor(
        message: string,
        statusCode: number = 500,
        code: string = 'INTERNAL_ERROR',
        details?: Record<string, unknown>[],
        isOperational: boolean = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.details = details;

        // Maintains proper prototype chain
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }

    // ── Factory methods for common errors ──

    static badRequest(message: string, details?: Record<string, unknown>[]) {
        return new AppError(message, 400, 'BAD_REQUEST', details);
    }

    static unauthorized(message: string = 'Authentication required') {
        return new AppError(message, 401, 'UNAUTHORIZED');
    }

    static forbidden(message: string = 'Access denied') {
        return new AppError(message, 403, 'FORBIDDEN');
    }

    static notFound(resource: string = 'Resource') {
        return new AppError(`${resource} not found`, 404, 'NOT_FOUND');
    }

    static conflict(message: string) {
        return new AppError(message, 409, 'CONFLICT');
    }

    static tooManyRequests(message: string = 'Too many requests. Please try again later.') {
        return new AppError(message, 429, 'RATE_LIMIT_EXCEEDED');
    }

    static internal(message: string = 'Internal server error') {
        return new AppError(message, 500, 'INTERNAL_ERROR', undefined, false);
    }

    static aiServiceError(message: string = 'AI analysis failed. Please try again.') {
        return new AppError(message, 502, 'AI_SERVICE_ERROR');
    }
}
