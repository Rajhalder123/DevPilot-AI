import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { generateCoverLetter } from '../services/ai.service';

// POST /api/cover-letter/generate
export const generate = asyncHandler(async (req: Request, res: Response) => {
    const { resumeText, jobDescription, companyName, tone } = req.body;

    const coverLetter = await generateCoverLetter({
        resumeText,
        jobDescription,
        companyName: companyName || 'the company',
        tone: tone || 'professional',
    });

    res.json({ coverLetter });
});
