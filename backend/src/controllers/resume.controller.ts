import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import * as resumeService from '../services/resume.service';

// POST /api/resume/upload
export const upload = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw AppError.badRequest('No file uploaded');

    const rawText = await resumeService.extractText(req.file.path);
    const resume = await resumeService.createFromUpload(
        req.user!._id.toString(),
        req.file.originalname,
        `/uploads/${req.file.filename}`,
        rawText
    );

    res.status(201).json({ resume });
});

// POST /api/resume/analyze
export const analyze = asyncHandler(async (req: Request, res: Response) => {
    const { resumeId } = req.body;
    const resume = await resumeService.analyzeById(resumeId, req.user!._id.toString());
    res.json({ resume });
});

// POST /api/resume/analyze-text
export const analyzeText = asyncHandler(async (req: Request, res: Response) => {
    const { text } = req.body;
    const resume = await resumeService.analyzeText(text, req.user!._id.toString());
    res.json({ resume });
});

// GET /api/resume/history
export const history = asyncHandler(async (req: Request, res: Response) => {
    const resumes = await resumeService.getHistory(req.user!._id.toString());
    res.json({ resumes });
});
