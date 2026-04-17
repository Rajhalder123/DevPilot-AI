import axios from 'axios';
import { logger } from '../utils/logger';
import { GitHubRepoData } from '../types/ai.types';

const GITHUB_API = 'https://api.github.com';

const getHeaders = (accessToken?: string) => {
    const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
    if (accessToken) headers.Authorization = `token ${accessToken}`;
    return headers;
};

/**
 * Enhanced GitHub repo data fetcher.
 * In addition to basic repo info, now fetches:
 * - Commit frequency (last year)
 * - File tree for test/CI/CD/Docker detection
 */
export const fetchRepoData = async (
    owner: string,
    repo: string,
    accessToken?: string
): Promise<GitHubRepoData> => {
    const headers = getHeaders(accessToken);

    // ── Parallel fetch: core data + enhanced data ────────────────────────────

    const [repoRes, readmeRes, languagesRes, commitActivityRes, treeRes] = await Promise.allSettled([
        axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, { headers }),
        axios.get(`${GITHUB_API}/repos/${owner}/${repo}/readme`, { headers }),
        axios.get(`${GITHUB_API}/repos/${owner}/${repo}/languages`, { headers }),
        axios.get(`${GITHUB_API}/repos/${owner}/${repo}/stats/commit_activity`, { headers, timeout: 8000 }),
        axios.get(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${encodeURIComponent('HEAD')}?recursive=1`, {
            headers,
            timeout: 8000,
        }).catch(() =>
            // Fallback: try 'main' branch if HEAD fails
            axios.get(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/main?recursive=1`, {
                headers,
                timeout: 8000,
            })
        ),
    ]);

    // ── Parse core data ─────────────────────────────────────────────────────

    const repoData = repoRes.status === 'fulfilled' ? repoRes.value.data : null;
    if (!repoData) throw new Error('Repository not found or not accessible');

    let readme = '';
    if (readmeRes.status === 'fulfilled') {
        readme = Buffer.from(readmeRes.value.data.content, 'base64').toString('utf-8');
    }

    const languages = languagesRes.status === 'fulfilled' ? languagesRes.value.data : {};

    // ── Parse commit activity ───────────────────────────────────────────────

    let commitFrequency: { totalLastYear: number; avgPerWeek: number } | undefined;
    if (commitActivityRes.status === 'fulfilled' && Array.isArray(commitActivityRes.value.data)) {
        const weeks = commitActivityRes.value.data as Array<{ total: number }>;
        const totalLastYear = weeks.reduce((sum, w) => sum + w.total, 0);
        const avgPerWeek = weeks.length > 0 ? Math.round((totalLastYear / weeks.length) * 10) / 10 : 0;
        commitFrequency = { totalLastYear, avgPerWeek };
    }

    // ── Parse file tree for project quality signals ─────────────────────────

    let hasTests = false;
    let hasCICD = false;
    let hasDockerfile = false;
    let directoryDepth = 0;
    let fileCount = 0;

    if (treeRes.status === 'fulfilled') {
        const tree = treeRes.value.data?.tree as Array<{ path: string; type: string }> || [];
        fileCount = tree.filter((f) => f.type === 'blob').length;

        for (const item of tree) {
            const p = item.path.toLowerCase();

            // Test detection
            if (
                p.includes('test') ||
                p.includes('spec') ||
                p.includes('__tests__') ||
                p.endsWith('.test.ts') ||
                p.endsWith('.test.js') ||
                p.endsWith('.spec.ts') ||
                p.endsWith('.spec.js')
            ) {
                hasTests = true;
            }

            // CI/CD detection
            if (
                p.includes('.github/workflows') ||
                p.includes('.gitlab-ci') ||
                p.includes('jenkinsfile') ||
                p.includes('.circleci') ||
                p.includes('.travis.yml')
            ) {
                hasCICD = true;
            }

            // Docker detection
            if (p === 'dockerfile' || p.endsWith('/dockerfile') || p.includes('docker-compose')) {
                hasDockerfile = true;
            }

            // Track max directory depth
            const depth = item.path.split('/').length;
            if (depth > directoryDepth) directoryDepth = depth;
        }
    } else {
        logger.debug('File tree fetch failed for repo, skipping enhanced analysis', {
            owner,
            repo,
        });
    }

    return {
        name: repoData.full_name,
        description: repoData.description || '',
        language: repoData.language || '',
        languages: Object.keys(languages),
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        topics: repoData.topics || [],
        readme: readme.substring(0, 3000),
        openIssues: repoData.open_issues_count,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        commitFrequency,
        hasTests,
        hasCICD,
        hasDockerfile,
        directoryDepth,
        fileCount,
    };
};

/**
 * Fetch authenticated user's repos (for GitHub OAuth users).
 */
export const fetchUserRepos = async (accessToken: string) => {
    const { data } = await axios.get(`${GITHUB_API}/user/repos`, {
        headers: getHeaders(accessToken),
        params: { sort: 'updated', per_page: 20 },
    });

    return data.map((repo: any) => ({
        name: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
    }));
};
