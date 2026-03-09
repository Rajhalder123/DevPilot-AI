import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { GitHubProject } from '../models/GitHubProject';
import { fetchRepoData } from '../services/github';
import { analyzeGitHubRepo } from '../services/openai';

const router = Router();

// POST /api/github/analyze
router.post('/analyze', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { repoUrl } = req.body;
        if (!repoUrl) {
            res.status(400).json({ error: 'Repository URL is required' });
            return;
        }

        // Parse owner/repo from URL
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) {
            res.status(400).json({ error: 'Invalid GitHub repository URL' });
            return;
        }

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
            res.status(500).json({ error: 'AI analysis failed. Please try again.' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/github/history
router.get('/history', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const projects = await GitHubProject.find({ userId: req.user!._id })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({ projects });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
