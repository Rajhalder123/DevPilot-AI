import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Resume } from '../models/Resume';
import { GitHubProject } from '../models/GitHubProject';
import { JobMatch } from '../models/JobMatch';
import { InterviewSession } from '../models/InterviewSession';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!._id;

        const [resumeCount, githubCount, jobCount, interviewCount, recentResumes, recentInterviews, avgInterviewScore] =
            await Promise.all([
                Resume.countDocuments({ userId }),
                GitHubProject.countDocuments({ userId }),
                JobMatch.countDocuments({ userId }),
                InterviewSession.countDocuments({ userId }),
                Resume.find({ userId }).sort({ createdAt: -1 }).limit(5).select('fileName status analysis.overallScore createdAt'),
                InterviewSession.find({ userId }).sort({ createdAt: -1 }).limit(5).select('topic difficulty score status createdAt'),
                InterviewSession.aggregate([
                    { $match: { userId: req.user!._id, score: { $ne: null } } },
                    { $group: { _id: null, avgScore: { $avg: '$score' } } },
                ]),
            ]);

        res.json({
            stats: {
                resumeCount,
                githubCount,
                jobCount,
                interviewCount,
                avgInterviewScore: avgInterviewScore[0]?.avgScore || 0,
            },
            recentResumes,
            recentInterviews,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
