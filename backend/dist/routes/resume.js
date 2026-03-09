"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const Resume_1 = require("../models/Resume");
const User_1 = require("../models/User");
const openai_1 = require("../services/openai");
const router = (0, express_1.Router)();
// POST /api/resume/upload
router.post('/upload', auth_1.authenticate, upload_1.upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const dataBuffer = fs_1.default.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        const rawText = pdfData.text;
        const resume = await Resume_1.Resume.create({
            userId: req.user._id,
            fileName: req.file.originalname,
            fileUrl: `/uploads/${req.file.filename}`,
            rawText,
            status: 'uploaded',
        });
        await User_1.User.findByIdAndUpdate(req.user._id, { $inc: { resumeCount: 1 } });
        res.status(201).json({ resume });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/resume/analyze
router.post('/analyze', auth_1.authenticate, async (req, res) => {
    try {
        const { resumeId } = req.body;
        const resume = await Resume_1.Resume.findOne({ _id: resumeId, userId: req.user._id });
        if (!resume) {
            res.status(404).json({ error: 'Resume not found' });
            return;
        }
        resume.status = 'analyzing';
        await resume.save();
        try {
            const analysis = await (0, openai_1.analyzeResume)(resume.rawText);
            resume.analysis = analysis;
            resume.status = 'completed';
            await resume.save();
            res.json({ resume });
        }
        catch (aiError) {
            console.error('AI analysis error:', aiError.message);
            resume.status = 'failed';
            await resume.save();
            res.status(500).json({ error: aiError.message || 'AI analysis failed. Please try again.' });
        }
    }
    catch (error) {
        console.error('Resume analyze error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
// POST /api/resume/analyze-text — Direct text analysis without upload
router.post('/analyze-text', auth_1.authenticate, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ error: 'Resume text is required' });
            return;
        }
        const analysis = await (0, openai_1.analyzeResume)(text);
        const resume = await Resume_1.Resume.create({
            userId: req.user._id,
            fileName: 'pasted-resume.txt',
            fileUrl: '',
            rawText: text,
            analysis,
            status: 'completed',
        });
        await User_1.User.findByIdAndUpdate(req.user._id, { $inc: { resumeCount: 1 } });
        res.json({ resume });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/resume/history
router.get('/history', auth_1.authenticate, async (req, res) => {
    try {
        const resumes = await Resume_1.Resume.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('-rawText');
        res.json({ resumes });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=resume.js.map