import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// ── In-process sliding-window store ──────────────────────────────────────────
// Works for single-node & can be swapped for Redis store in production
// by replacing `windowMs` store with rate-limit-redis.

/**
 * Build a consistent key that combines:
 *  - Authenticated user ID (if logged in) — prevents shared-IP abuse
 *  - Client IP — fallback for unauthenticated routes
 *  - Route group — separate counters per endpoint tier
 */
function buildKey(req: Request, group: string): string {
    const userId = (req as any).user?._id?.toString();
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    return userId ? `${group}:user:${userId}` : `${group}:ip:${ip}`;
}

/** Attach rich Retry-After and X-RateLimit-* headers the frontend can consume */
function attachHeaders(res: Response, windowMs: number, max: number, remaining: number): void {
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining));
    res.setHeader('X-RateLimit-Reset', Math.ceil((Date.now() + windowMs) / 1000));
}

/** Standard 429 JSON body */
function tooManyRequests(res: Response, retryAfterSec: number, msg: string): void {
    res.setHeader('Retry-After', retryAfterSec);
    res.status(429).json({
        success: false,
        error: msg,
        retryAfter: retryAfterSec,
        code: 'RATE_LIMIT_EXCEEDED',
    });
}

// ── Tier definitions ──────────────────────────────────────────────────────────

/**
 * TIER 1 — General API
 * 300 req / 15 min per user|IP — very generous for normal browsing
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => buildKey(req, 'general'),
    skip: (req) => req.path === '/api/health',          // never rate-limit health check
    handler: (req, res) => {
        logger.warn(`[RateLimit] GENERAL exceeded`, { ip: req.ip, path: req.path });
        tooManyRequests(res, 60, 'Too many requests — please slow down.');
    },
});

/**
 * TIER 2 — Auth (login / signup)
 * Strict: 15 req / 15 min — blocks brute-force
 * Uses exponential-style messaging to guide the user
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => buildKey(req, 'auth'),
    handler: (req, res) => {
        logger.warn(`[RateLimit] AUTH exceeded`, { ip: req.ip });
        tooManyRequests(res, 15 * 60, 'Too many login attempts — try again in 15 minutes.');
    },
});

/**
 * TIER 3 — AI endpoints (chat, resume, interviews, cover-letter, score)
 * 60 req / 15 min per authenticated user — generous for real developers
 * Unauth requests get 10 req / 15 min
 */
export const aiLimiter = ((req: Request, res: Response, next: NextFunction) => {
    const isAuth = !!(req as any).user;
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: isAuth ? 60 : 10,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        keyGenerator: (r) => buildKey(r, 'ai'),
        handler: (r, rs) => {
            logger.warn(`[RateLimit] AI exceeded`, {
                user: (r as any).user?._id,
                ip: r.ip,
                path: r.path,
            });
            tooManyRequests(rs, 5 * 60, isAuth
                ? 'AI request limit reached (60/15min). Please wait 5 minutes.'
                : 'Please sign in to unlock higher AI usage limits.'
            );
        },
    });
    limiter(req, res, next);
}) as any;

/**
 * TIER 4 — Heavy AI (resume full-analysis, job-ready-score)
 * 10 req / 60 min per user — these are expensive Groq calls
 */
export const heavyAiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => buildKey(req, 'heavy-ai'),
    handler: (req, res) => {
        logger.warn(`[RateLimit] HEAVY_AI exceeded`, {
            user: (req as any).user?._id,
            ip: req.ip,
        });
        tooManyRequests(res, 60 * 60, 'Heavy analysis limit reached (10/hour). This resets every hour.');
    },
});

/**
 * TIER 5 — Upload endpoints (resume PDF upload)
 * 20 uploads / 60 min per user
 */
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => buildKey(req, 'upload'),
    handler: (req, res) => {
        logger.warn(`[RateLimit] UPLOAD exceeded`, {
            user: (req as any).user?._id,
            ip: req.ip,
        });
        tooManyRequests(res, 60 * 60, 'Upload limit reached (20/hour). Please wait before uploading more files.');
    },
});

/**
 * TIER 6 — GitHub scan (hits external GitHub API)
 * 30 scans / 60 min per user
 */
export const githubLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => buildKey(req, 'github'),
    handler: (req, res) => {
        logger.warn(`[RateLimit] GITHUB exceeded`, {
            user: (req as any).user?._id,
            ip: req.ip,
        });
        tooManyRequests(res, 60 * 60, 'GitHub scan limit reached (30/hour).');
    },
});

/**
 * TIER 7 — WebSocket / Socket.IO connection rate
 * Used externally — 50 connect events / 5 min per IP
 */
export const socketConnectionLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => `socket:${req.ip}`,
    handler: (_req, res) => {
        tooManyRequests(res, 5 * 60, 'Too many connections. Please wait 5 minutes.');
    },
});
