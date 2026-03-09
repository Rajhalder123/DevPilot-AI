import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser } from '../models/User';

// Augment Express's Request globally so all routes typecheck correctly
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export type AuthRequest = Request;

export const authenticate: RequestHandler = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access denied. No token provided.' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401).json({ error: 'Invalid token. User not found.' });
            return;
        }

        (req as any).user = user;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};
