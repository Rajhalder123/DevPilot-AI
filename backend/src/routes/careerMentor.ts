import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { careerMentorChat } from '../services/openai';

const router = Router();

// POST /api/career-mentor/chat
router.post('/chat', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { message, history = [] } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        const response = await careerMentorChat(message.trim(), history);

        res.json({ response });
    } catch (error: any) {
        console.error('Career Mentor error:', error);
        res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
    }
});

export default router;
