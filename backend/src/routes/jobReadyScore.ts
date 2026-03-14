import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Resume } from '../models/Resume';
import { GitHubProject } from '../models/GitHubProject';
import { InterviewSession } from '../models/InterviewSession';

const router = Router();

// GET /api/job-ready-score
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!._id;

        // Fetch all relevant data
        const [resumes, githubProjects, interviews] = await Promise.all([
            Resume.find({ userId }).sort({ createdAt: -1 }).limit(5),
            GitHubProject.find({ userId }).sort({ createdAt: -1 }).limit(5),
            InterviewSession.find({ userId, status: 'completed', score: { $ne: null } }).sort({ createdAt: -1 }).limit(5),
        ]);

        // Calculate component scores
        const resumeScores = resumes
            .filter((r: any) => r.analysis?.overallScore)
            .map((r: any) => r.analysis.overallScore);
        const avgResumeScore = resumeScores.length > 0
            ? Math.round(resumeScores.reduce((a: number, b: number) => a + b, 0) / resumeScores.length)
            : 0;

        const githubScores = githubProjects
            .filter((g: any) => g.analysis?.overallScore)
            .map((g: any) => g.analysis.overallScore);
        const avgGithubScore = githubScores.length > 0
            ? Math.round(githubScores.reduce((a: number, b: number) => a + b, 0) / githubScores.length)
            : 0;

        const interviewScores = interviews
            .filter((i: any) => i.score)
            .map((i: any) => i.score);
        const avgInterviewScore = interviewScores.length > 0
            ? Math.round(interviewScores.reduce((a: number, b: number) => a + b, 0) / interviewScores.length)
            : 0;

        // Skills score based on user profile
        const userSkills = (req.user as any)?.skills || [];
        const skillsScore = Math.min(100, userSkills.length * 10);

        // Project count bonus
        const projectScore = Math.min(100, githubProjects.length * 20);

        // Weighted overall score
        const weights = { resume: 0.3, github: 0.25, interview: 0.25, skills: 0.1, projects: 0.1 };
        const overallScore = Math.round(
            avgResumeScore * weights.resume +
            avgGithubScore * weights.github +
            avgInterviewScore * weights.interview +
            skillsScore * weights.skills +
            projectScore * weights.projects
        );

        // Generate improvement suggestions
        const improvements: string[] = [];
        if (avgResumeScore < 70) improvements.push('Improve your resume — optimize keywords and formatting for ATS');
        if (avgResumeScore === 0) improvements.push('Upload and analyze your resume to boost your score');
        if (avgGithubScore < 70) improvements.push('Improve your GitHub projects — add READMEs, tests, and deployment');
        if (githubProjects.length === 0) improvements.push('Analyze at least one GitHub project to get scored');
        if (avgInterviewScore < 70) improvements.push('Practice more mock interviews to improve your score');
        if (interviews.length === 0) improvements.push('Complete at least one AI interview session');
        if (userSkills.length < 5) improvements.push('Add more skills to your profile');
        if (githubProjects.length < 3) improvements.push('Build and analyze more projects (aim for 3+)');

        res.json({
            overallScore,
            breakdown: {
                resume: { score: avgResumeScore, count: resumes.length, weight: '30%' },
                github: { score: avgGithubScore, count: githubProjects.length, weight: '25%' },
                interview: { score: avgInterviewScore, count: interviews.length, weight: '25%' },
                skills: { score: skillsScore, count: userSkills.length, weight: '10%' },
                projects: { score: projectScore, count: githubProjects.length, weight: '10%' },
            },
            improvements,
            shareText: `My Job Ready Score: ${overallScore}% 🚀 Check yours at DevPilot AI!`,
        });
    } catch (error: any) {
        console.error('Job Ready Score error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
