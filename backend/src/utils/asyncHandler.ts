import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async Express route handler to automatically catch errors
 * and forward them to the centralized error handler via next().
 *
 * Eliminates the need for try/catch in every controller function.
 *
 * Usage: router.get('/path', asyncHandler(myController));
 */
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;

export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
