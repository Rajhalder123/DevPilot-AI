"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const GitHubProject_1 = require("../models/GitHubProject");
const github_1 = require("../services/github");
const openai_1 = require("../services/openai");
const router = (0, express_1.Router)();
// POST /api/github/analyze
router.post('/analyze', auth_1.authenticate, async (req, res) => {
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
        const user = req.user;
        const repoData = await (0, github_1.fetchRepoData)(owner, repoName, user.githubAccessToken);
        // Create project record
        const project = await GitHubProject_1.GitHubProject.create({
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
            const analysis = await (0, openai_1.analyzeGitHubRepo)(repoData);
            project.analysis = analysis;
            project.status = 'completed';
            await project.save();
            res.json({ project });
        }
        catch (aiError) {
            project.status = 'failed';
            await project.save();
            res.status(500).json({ error: 'AI analysis failed. Please try again.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/github/history
router.get('/history', auth_1.authenticate, async (req, res) => {
    try {
        const projects = await GitHubProject_1.GitHubProject.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json({ projects });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=github.js.map