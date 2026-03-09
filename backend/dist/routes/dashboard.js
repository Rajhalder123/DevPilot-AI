"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Resume_1 = require("../models/Resume");
const GitHubProject_1 = require("../models/GitHubProject");
const JobMatch_1 = require("../models/JobMatch");
const InterviewSession_1 = require("../models/InterviewSession");
const router = (0, express_1.Router)();
// GET /api/dashboard/stats
router.get('/stats', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const [resumeCount, githubCount, jobCount, interviewCount, recentResumes, recentInterviews, avgInterviewScore] = await Promise.all([
            Resume_1.Resume.countDocuments({ userId }),
            GitHubProject_1.GitHubProject.countDocuments({ userId }),
            JobMatch_1.JobMatch.countDocuments({ userId }),
            InterviewSession_1.InterviewSession.countDocuments({ userId }),
            Resume_1.Resume.find({ userId }).sort({ createdAt: -1 }).limit(5).select('fileName status analysis.overallScore createdAt'),
            InterviewSession_1.InterviewSession.find({ userId }).sort({ createdAt: -1 }).limit(5).select('topic difficulty score status createdAt'),
            InterviewSession_1.InterviewSession.aggregate([
                { $match: { userId: req.user._id, score: { $ne: null } } },
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map