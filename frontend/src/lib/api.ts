import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ── GET Request Cache (15s stale time) ───────────────────────────────────────
// Prevents duplicate calls from Dashboard + Sidebar + hot-reload firing together.
// Only caches GET requests — mutations (POST/PUT/DELETE) always hit the server.
const CACHE_TTL_MS = 15_000; // 15 seconds
const cache = new Map<string, { data: any; expiresAt: number }>();
const inFlight = new Map<string, Promise<any>>();

export function getCached<T = any>(url: string, fetcher: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const hit = cache.get(url);
    if (hit && hit.expiresAt > now) return Promise.resolve(hit.data);

    // Deduplicate concurrent identical calls
    const existing = inFlight.get(url);
    if (existing) return existing;

    const promise = fetcher().then(data => {
        cache.set(url, { data, expiresAt: now + CACHE_TTL_MS });
        inFlight.delete(url);
        return data;
    }).catch(err => {
        inFlight.delete(url);
        throw err;
    });
    inFlight.set(url, promise);
    return promise;
}

export function invalidateCache(urlPattern?: string) {
    if (!urlPattern) { cache.clear(); return; }
    for (const key of cache.keys()) {
        if (key.includes(urlPattern)) cache.delete(key);
    }
}

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

// JWT interceptor
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('devpilot_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Retry config
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config as any;
        const status = error.response?.status;

        // ── 401 Unauthorized → clear token & redirect ─────────────────────
        if (status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('devpilot_token');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        // ── 429 Too Many Requests → smart handling per route type ─────────
        if (status === 429) {
            const retryAfterHeader = error.response?.headers?.['retry-after'];
            const retryAfterSec = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
            const url: string = config?.url || '';

            // Auth routes must NEVER auto-retry — show countdown in the UI instead
            const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/signup') || url.includes('/auth/register');
            if (isAuthRoute) {
                const err: any = new Error(
                    error.response?.data?.error ||
                    `Too many login attempts. Please wait ${Math.ceil(retryAfterSec / 60)} minute(s) before trying again.`
                );
                err.isRateLimit = true;
                err.retryAfterSec = retryAfterSec;
                return Promise.reject(err);
            }

            // AI / general endpoints: auto-retry up to 3 times with server's Retry-After
            config._retryCount = (config._retryCount || 0) + 1;
            if (config._retryCount <= MAX_RETRIES) {
                const cappedSec = Math.min(retryAfterSec, 60); // cap at 60s per retry
                const jitter = Math.random() * 1000;
                const waitMs = cappedSec * 1000 + jitter;
                console.warn(`[API] 429 on ${url}. Retrying in ${(waitMs / 1000).toFixed(1)}s (attempt ${config._retryCount}/${MAX_RETRIES})`);
                await sleep(waitMs);
                return api(config);
            }
            return Promise.reject(new Error(
                error.response?.data?.error || 'Rate limit reached. Please wait a moment and try again.'
            ));
        }

        // ── 502 / 503 Transient server errors → short exponential retry ───
        if (status === 502 || status === 503) {
            config._retryCount = (config._retryCount || 0) + 1;
            if (config._retryCount <= 2) {
                const waitMs = BASE_DELAY_MS * Math.pow(2, config._retryCount) + Math.random() * 500;
                console.warn(`[API] ${status} server error. Retrying in ${(waitMs / 1000).toFixed(1)}s`);
                await sleep(waitMs);
                return api(config);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
