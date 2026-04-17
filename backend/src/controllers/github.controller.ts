import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { GitHubProject } from '../models/GitHubProject';
import { fetchRepoData } from '../services/github.service';
import { analyzeGitHubRepo } from '../services/ai.service';

// POST /api/github/analyze
export const analyze = asyncHandler(async (req: Request, res: Response) => {
    const { repoUrl } = req.body;

    // Parse owner/repo from URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) throw AppError.badRequest('Invalid GitHub repository URL');

    const [, owner, repo] = match;
    const repoName = repo.replace('.git', '');

    // Fetch repo data from GitHub API
    const user = req.user!;
    const repoData = await fetchRepoData(owner, repoName, (user as any).githubAccessToken);

    // Create project record
    const project = await GitHubProject.create({
        userId: user._id,
        repoUrl,
        repoName: repoData.name,
        owner,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stars,
        forks: repoData.forks,
        status: 'analyzing',
    });

    try {
        const analysis = await analyzeGitHubRepo(repoData);
        project.analysis = analysis;
        project.status = 'completed';
        await project.save();
        res.json({ project });
    } catch (aiError) {
        project.status = 'failed';
        await project.save();
        throw AppError.aiServiceError('AI analysis failed. Please try again.');
    }
});

// GET /api/github/history
export const history = asyncHandler(async (req: Request, res: Response) => {
    const projects = await GitHubProject.find({ userId: req.user!._id })
        .sort({ createdAt: -1 })
        .limit(20);
    res.json({ projects });
});
