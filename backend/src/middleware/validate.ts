import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

/**
 * Express middleware factory that validates request body against a Zod schema.
 * On failure, throws an AppError(400) with structured field-level error details.
 *
 * Usage: router.post('/path', validate(mySchema), controller);
 */
export const validate = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req.body);
            // Replace body with parsed (and potentially transformed/defaulted) values
            req.body = parsed;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const details = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                next(AppError.badRequest('Validation failed', details));
            } else {
                next(error);
            }
        }
    };
};

/**
 * Validates query parameters against a Zod schema.
 */
export const validateQuery = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req.query);
            (req as any).validatedQuery = parsed;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const details = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                next(AppError.badRequest('Query validation failed', details));
            } else {
                next(error);
            }
        }
    };
};
