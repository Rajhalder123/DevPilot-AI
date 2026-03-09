import { Request, RequestHandler } from 'express';
import { IUser } from '../models/User';
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
export type AuthRequest = Request;
export declare const authenticate: RequestHandler;
//# sourceMappingURL=auth.d.ts.map