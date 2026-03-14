import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generatePortfolioContent } from '../services/openai';

const router = Router();

// POST /api/portfolio/generate
router.post('/generate', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, bio, skills, projects, github, linkedin, email } = req.body;

        if (!name || !bio) {
            res.status(400).json({ error: 'Name and bio are required' });
            return;
        }

        const html = await generatePortfolioContent({
            name,
            bio,
            skills: skills || [],
            projects: projects || [],
            github: github || '',
            linkedin: linkedin || '',
            email: email || '',
        });

        // Clean any markdown code fences the LLM might wrap around the HTML
        const cleanedHtml = html
            .replace(/^```(?:html)?\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();

        res.json({ html: cleanedHtml });
    } catch (error: any) {
        console.error('Portfolio generation error:', error);
        res.status(500).json({ error: 'Failed to generate portfolio. Please try again.' });
    }
});

export default router;
