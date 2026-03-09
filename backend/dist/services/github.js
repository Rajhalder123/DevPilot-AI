"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserRepos = exports.fetchRepoData = void 0;
const axios_1 = __importDefault(require("axios"));
const GITHUB_API = 'https://api.github.com';
const fetchRepoData = async (owner, repo, accessToken) => {
    const headers = { Accept: 'application/vnd.github.v3+json' };
    if (accessToken)
        headers.Authorization = `token ${accessToken}`;
    const [repoRes, readmeRes, languagesRes] = await Promise.allSettled([
        axios_1.default.get(`${GITHUB_API}/repos/${owner}/${repo}`, { headers }),
        axios_1.default.get(`${GITHUB_API}/repos/${owner}/${repo}/readme`, { headers }),
        axios_1.default.get(`${GITHUB_API}/repos/${owner}/${repo}/languages`, { headers }),
    ]);
    const repoData = repoRes.status === 'fulfilled' ? repoRes.value.data : null;
    if (!repoData)
        throw new Error('Repository not found or not accessible');
    let readme = '';
    if (readmeRes.status === 'fulfilled') {
        readme = Buffer.from(readmeRes.value.data.content, 'base64').toString('utf-8');
    }
    const languages = languagesRes.status === 'fulfilled' ? languagesRes.value.data : {};
    return {
        name: repoData.full_name,
        description: repoData.description || '',
        language: repoData.language || '',
        languages: Object.keys(languages),
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        topics: repoData.topics || [],
        readme: readme.substring(0, 3000), // Limit for API context
        openIssues: repoData.open_issues_count,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
    };
};
exports.fetchRepoData = fetchRepoData;
const fetchUserRepos = async (accessToken) => {
    const { data } = await axios_1.default.get(`${GITHUB_API}/user/repos`, {
        headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
        },
        params: { sort: 'updated', per_page: 20 },
    });
    return data.map((repo) => ({
        name: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
    }));
};
exports.fetchUserRepos = fetchUserRepos;
//# sourceMappingURL=github.js.map