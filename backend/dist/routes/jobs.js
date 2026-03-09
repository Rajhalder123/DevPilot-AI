"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const JobMatch_1 = require("../models/JobMatch");
const openai_1 = require("../services/openai");
const router = (0, express_1.Router)();
// POST /api/jobs/recommend
router.post('/recommend', auth_1.authenticate, async (req, res) => {
    try {
        const { skills, experience, preferences } = req.body;
        const user = req.user;
        const userSkills = skills || user.skills || [];
        const userExperience = experience || 'Not specified';
        const userPreferences = preferences || 'Remote roles in tech';
        const recommendations = await (0, openai_1.recommendJobs)({
            skills: userSkills,
            experience: userExperience,
            preferences: userPreferences,
        });
        // Save to DB
        const savedJobs = await Promise.all(recommendations.map((job) => JobMatch_1.JobMatch.create({
            userId: user._id,
            ...job,
        })));
        res.json({ jobs: savedJobs });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/jobs/matches
router.get('/matches', auth_1.authenticate, async (req, res) => {
    try {
        const jobs = await JobMatch_1.JobMatch.find({ userId: req.user._id })
            .sort({ matchScore: -1 })
            .limit(30);
        res.json({ jobs });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=jobs.js.map