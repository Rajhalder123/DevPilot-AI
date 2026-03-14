import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateSkillRoadmap } from '../services/openai';

const router = Router();

// POST /api/roadmap/generate
router.post('/generate', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { skills, targetRole } = req.body;

        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            res.status(400).json({ error: 'Skills array is required' });
            return;
        }
        if (!targetRole || typeof targetRole !== 'string') {
            res.status(400).json({ error: 'Target role is required' });
            return;
        }

        const roadmap = await generateSkillRoadmap(skills, targetRole);

        res.json({ roadmap });
    } catch (error: any) {
        console.error('Roadmap generation error:', error);
        res.status(500).json({ error: 'Failed to generate roadmap. Please try again.' });
    }
});

export default router;
