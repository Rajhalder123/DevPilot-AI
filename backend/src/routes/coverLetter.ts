import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateCoverLetter } from '../services/openai';

const router = Router();

// POST /api/cover-letter/generate
router.post('/generate', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { resumeText, jobDescription, companyName, tone } = req.body;

        if (!resumeText || !jobDescription) {
            res.status(400).json({ error: 'Resume text and job description are required' });
            return;
        }

        const coverLetter = await generateCoverLetter({
            resumeText,
            jobDescription,
            companyName: companyName || 'the company',
            tone: tone || 'professional',
        });

        res.json({ coverLetter });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
