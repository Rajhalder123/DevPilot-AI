"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const openai_1 = require("../services/openai");
const router = (0, express_1.Router)();
// POST /api/cover-letter/generate
router.post('/generate', auth_1.authenticate, async (req, res) => {
    try {
        const { resumeText, jobDescription, companyName, tone } = req.body;
        if (!resumeText || !jobDescription) {
            res.status(400).json({ error: 'Resume text and job description are required' });
            return;
        }
        const coverLetter = await (0, openai_1.generateCoverLetter)({
            resumeText,
            jobDescription,
            companyName: companyName || 'the company',
            tone: tone || 'professional',
        });
        res.json({ coverLetter });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=coverLetter.js.map