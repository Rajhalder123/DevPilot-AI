import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Middleware to restrict access to admin-only routes.
 * Must be used AFTER the `authenticate` middleware so that `req.user` is populated.
 */
export const requireAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        return;
    }
    next();
};
