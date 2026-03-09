import { Router, Response } from 'express';
import axios from 'axios';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// ── Normalizers ──────────────────────────────────────────────────────────────

const normalizeRemotive = (job: any) => ({
    id: `remotive-${job.id}`,
    title: job.title,
    company: job.company_name,
    companyLogo: job.company_logo_url || '',
    location: job.candidate_required_location || 'Remote',
    type: 'remote',
    salary: job.salary || '',
    description: (job.description || '').replace(/<[^>]*>/g, '').substring(0, 280) + '...',
    tags: job.tags || [],
    applyUrl: job.url,
    source: 'Remotive',
    postedAt: job.publication_date,
});

const normalizeArbeitnow = (job: any) => ({
    id: `arbeitnow-${job.slug}`,
    title: job.title,
    company: job.company_name,
    companyLogo: job.company_logo || '',
    location: job.location || 'Remote',
    type: job.remote ? 'remote' : 'onsite',
    salary: '',
    description: (job.description || '').replace(/<[^>]*>/g, '').substring(0, 280) + '...',
    tags: job.tags || [],
    applyUrl: job.url,
    source: 'Arbeitnow',
    postedAt: job.created_at,
});

const normalizeMuse = (job: any) => ({
    id: `muse-${job.id}`,
    title: job.name,
    company: job.company?.name || '',
    companyLogo: '',
    location: job.locations?.[0]?.name || 'Remote',
    type: (job.locations?.[0]?.name || '').toLowerCase().includes('remote') ? 'remote' : 'onsite',
    salary: '',
    description: (job.contents || '').replace(/<[^>]*>/g, '').substring(0, 280) + '...',
    tags: job.categories?.map((c: any) => c.name) || [],
    applyUrl: job.refs?.landing_page || job.short_name,
    source: 'The Muse',
    postedAt: job.publication_date,
});

const normalizeJobicy = (job: any) => ({
    id: `jobicy-${job.id}`,
    title: job.jobTitle,
    company: job.companyName,
    companyLogo: job.companyLogo || '',
    location: `${job.jobGeo || 'Remote'} · ${job.jobRegion || ''}`.trim().replace(/·\s*$/, ''),
    type: 'remote',
    salary: job.annualSalaryMin ? `$${job.annualSalaryMin / 1000}k–$${job.annualSalaryMax / 1000}k` : '',
    description: (job.jobDescription || '').replace(/<[^>]*>/g, '').substring(0, 280) + '...',
    tags: job.jobIndustry ? [job.jobIndustry] : [],
    applyUrl: job.url,
    source: 'Jobicy',
    postedAt: job.pubDate,
});

const normalizeRemoteOK = (job: any) => ({
    id: `remoteok-${job.id}`,
    title: job.position,
    company: job.company,
    companyLogo: job.logo || '',
    location: 'Remote',
    type: 'remote',
    salary: job.salary || '',
    description: (job.description || '').replace(/<[^>]*>/g, '').substring(0, 280) + '...',
    tags: job.tags || [],
    applyUrl: job.url,
    source: 'RemoteOK',
    postedAt: new Date(job.epoch * 1000).toISOString(),
});

const normalizeHimalayas = (job: any) => ({
    id: `himalayas-${job.id || job.slug}`,
    title: job.title,
    company: job.companyName,
    companyLogo: job.companyLogo || '',
    location: job.locationRestrictions?.join(', ') || 'Remote',
    type: 'remote',
    salary: job.salary || '',
    description: (job.description || '').replace(/<[^>]*>/g, '').substring(0, 280) + '...',
    tags: job.tags || job.categories || [],
    applyUrl: job.applyUrl || `https://himalayas.app/jobs/${job.slug}`,
    source: 'Himalayas',
    postedAt: job.publishedAt || job.createdAt,
});

// ── Helper: safe parallel fetch ───────────────────────────────────────────────

async function safeFetch<T>(fetcher: () => Promise<T[]>): Promise<T[]> {
    try {
        return await fetcher();
    } catch {
        return [];
    }
}

// ── Route ─────────────────────────────────────────────────────────────────────

router.get('/search', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { query = '', page = '1' } = req.query as Record<string, string>;
        const q = (query || 'developer').toLowerCase();
        const pageNum = parseInt(page) || 1;

        const [remotiveJobs, arbeitnowJobs, museJobs, jobicyJobs, remoteOKJobs, himalayasJobs] =
            await Promise.all([
                // 1. Remotive
                safeFetch(async () => {
                    const r = await axios.get('https://remotive.com/api/remote-jobs', {
                        params: { search: q, limit: 20 }, timeout: 8000,
                    });
                    return (r.data.jobs || []).map(normalizeRemotive);
                }),
                // 2. Arbeitnow
                safeFetch(async () => {
                    const r = await axios.get('https://www.arbeitnow.com/api/job-board-api', {
                        params: { page: pageNum }, timeout: 8000,
                    });
                    const all = (r.data.data || []) as any[];
                    return all
                        .filter((j: any) => `${j.title} ${(j.tags || []).join(' ')}`.toLowerCase().includes(q))
                        .slice(0, 15)
                        .map(normalizeArbeitnow);
                }),
                // 3. The Muse
                safeFetch(async () => {
                    const r = await axios.get('https://www.themuse.com/api/public/jobs', {
                        params: { category: 'Software Engineer', page: pageNum - 1, level: 'Mid Level,Senior Level,Junior Level' },
                        timeout: 8000,
                    });
                    const all = (r.data.results || []) as any[];
                    return all
                        .filter((j: any) => `${j.name} ${(j.categories || []).map((c: any) => c.name).join(' ')}`.toLowerCase().includes(q))
                        .slice(0, 12)
                        .map(normalizeMuse);
                }),
                // 4. Jobicy
                safeFetch(async () => {
                    const r = await axios.get('https://jobicy.com/api/v2/remote-jobs', {
                        params: { count: 20, industry: 'engineering', tag: q }, timeout: 8000,
                    });
                    return ((r.data.jobs || []) as any[]).map(normalizeJobicy);
                }),
                // 5. RemoteOK
                safeFetch(async () => {
                    const r = await axios.get('https://remoteok.com/api', {
                        params: { tag: q }, timeout: 8000,
                        headers: { 'User-Agent': 'DevPilot-AI/1.0' },
                    });
                    const all = (r.data || []) as any[];
                    return all
                        .filter((j: any) => j.position) // skip legal notice first item
                        .slice(0, 15)
                        .map(normalizeRemoteOK);
                }),
                // 6. Himalayas
                safeFetch(async () => {
                    const r = await axios.get('https://himalayas.app/jobs/api', {
                        params: { q, limit: 15 }, timeout: 8000,
                    });
                    return ((r.data.jobs || []) as any[]).map(normalizeHimalayas);
                }),
            ]);

        const all = [
            ...remotiveJobs, ...arbeitnowJobs, ...museJobs,
            ...jobicyJobs, ...remoteOKJobs, ...himalayasJobs,
        ];

        if (all.length === 0) {
            res.status(503).json({ error: 'All job APIs are temporarily unavailable. Please try again shortly.' });
            return;
        }

        // De-duplicate by applyUrl
        const seen = new Set<string>();
        const jobs: any[] = all.filter((j: any) => {
            if (!j.applyUrl || seen.has(j.applyUrl)) return false;
            seen.add(j.applyUrl);
            return true;
        });

        // Sort newest first
        jobs.sort((a: any, b: any) => new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime());

        res.json({ jobs, total: jobs.length });
    } catch (error: any) {
        console.error('Job search error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
