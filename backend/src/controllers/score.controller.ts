import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';
import { analyzeResume, analyzeGitHubRepo, generateFinalInsights } from '../services/ai.service';
import { fetchRepoData } from '../services/github.service';
import { scoringEngine } from '../services/scoring.service';
import { AppError } from '../utils/AppError';
import { FullAnalysisResult } from '../types/score.types';

/**
 * POST /api/score/full-analysis
 *
 * The unified "Job Readiness Intelligence Engine" endpoint.
 * Accepts resume text + GitHub URL + skills, runs parallel analysis,
 * calculates the combined score, and returns AI-powered improvements.
 */
export const fullAnalysis = asyncHandler(async (req: Request, res: Response) => {
    const { resumeText, repoUrl, skills } = req.body;

    logger.info('Starting full analysis', {
        userId: req.user?._id?.toString(),
        repoUrl,
        skillsCount: skills.length,
    });

    // ── Step 1: Parse GitHub URL ────────────────────────────────────────────
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) throw AppError.badRequest('Invalid GitHub repository URL');

    const [, owner, repo] = match;
    const repoName = repo.replace('.git', '');

    // ── Step 2: Parallel analysis — Resume + GitHub ─────────────────────────
    const [resumeAnalysis, repoData] = await Promise.all([
        analyzeResume(resumeText),
        fetchRepoData(owner, repoName, (req.user as any)?.githubAccessToken),
    ]);

    const githubAnalysis = await analyzeGitHubRepo(repoData);

    // ── Step 3: Calculate combined score ─────────────────────────────────────
    const scoring = scoringEngine.calculateScore({
        resumeScore: resumeAnalysis.overallScore,
        githubScore: githubAnalysis.overallScore,
        skills,
    });

    // ── Step 4: Generate AI-powered improvement insights ─────────────────────
    let improvements: string[];
    try {
        improvements = await generateFinalInsights(
            resumeAnalysis,
            githubAnalysis,
            scoring.finalScore,
            scoring.category,
            skills
        );
    } catch (error) {
        logger.warn('AI insights generation failed, using engine-generated improvements');
        improvements = scoring.improvements;
    }

    // ── Step 5: Return unified response ──────────────────────────────────────
    const result: FullAnalysisResult = {
        resumeAnalysis,
        githubAnalysis,
        scoring: {
            ...scoring,
            improvements,
        },
        generatedAt: new Date().toISOString(),
    };

    logger.info('Full analysis completed', {
        userId: req.user?._id?.toString(),
        finalScore: scoring.finalScore,
        category: scoring.category,
    });

    res.json({
        success: true,
        data: result,
    });
});
