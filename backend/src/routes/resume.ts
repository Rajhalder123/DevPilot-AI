import { Router, Response } from 'express';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');
import { authenticate, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { Resume } from '../models/Resume';
import { User } from '../models/User';
import { analyzeResume } from '../services/openai';

const router = Router();

// POST /api/resume/upload
router.post('/upload', authenticate, upload.single('resume'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        const rawText = pdfData.text;

        const resume = await Resume.create({
            userId: req.user!._id,
            fileName: req.file.originalname,
            fileUrl: `/uploads/${req.file.filename}`,
            rawText,
            status: 'uploaded',
        });

        await User.findByIdAndUpdate(req.user!._id, { $inc: { resumeCount: 1 } });

        res.status(201).json({ resume });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/resume/analyze
router.post('/analyze', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { resumeId } = req.body;

        const resume = await Resume.findOne({ _id: resumeId, userId: req.user!._id });
        if (!resume) {
            res.status(404).json({ error: 'Resume not found' });
            return;
        }

        resume.status = 'analyzing';
        await resume.save();

        try {
            const analysis = await analyzeResume(resume.rawText);
            resume.analysis = analysis;
            resume.status = 'completed';
            await resume.save();

            res.json({ resume });
        } catch (aiError: any) {
            console.error('AI analysis error:', aiError.message);
            resume.status = 'failed';
            await resume.save();
            res.status(500).json({ error: aiError.message || 'AI analysis failed. Please try again.' });
        }
    } catch (error: any) {
        console.error('Resume analyze error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/resume/analyze-text — Direct text analysis without upload
router.post('/analyze-text', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ error: 'Resume text is required' });
            return;
        }

        const analysis = await analyzeResume(text);

        const resume = await Resume.create({
            userId: req.user!._id,
            fileName: 'pasted-resume.txt',
            fileUrl: '',
            rawText: text,
            analysis,
            status: 'completed',
        });

        await User.findByIdAndUpdate(req.user!._id, { $inc: { resumeCount: 1 } });

        res.json({ resume });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/resume/history
router.get('/history', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const resumes = await Resume.find({ userId: req.user!._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('-rawText');

        res.json({ resumes });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
