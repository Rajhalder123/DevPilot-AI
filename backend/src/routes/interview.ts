import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { InterviewSession } from '../models/InterviewSession';
import { User } from '../models/User';
import { generateInterviewQuestion } from '../services/openai';

const router = Router();

// POST /api/interview/start
router.post('/start', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { topic, difficulty, type } = req.body;

        if (!topic) {
            res.status(400).json({ error: 'Interview topic is required' });
            return;
        }

        const initialMessage = await generateInterviewQuestion(
            topic,
            difficulty || 'mid',
            type || 'technical',
            []
        );

        const session = await InterviewSession.create({
            userId: req.user!._id,
            topic,
            difficulty: difficulty || 'mid',
            type: type || 'technical',
            messages: [{ role: 'assistant', content: initialMessage, timestamp: new Date() }],
            questionsAsked: 1,
            status: 'active',
        });

        await User.findByIdAndUpdate(req.user!._id, { $inc: { interviewCount: 1 } });

        res.status(201).json({ session });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/interview/:sessionId/respond
router.post('/:sessionId/respond', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { message } = req.body;
        const session = await InterviewSession.findOne({
            _id: req.params.sessionId,
            userId: req.user!._id,
        });

        if (!session) {
            res.status(404).json({ error: 'Session not found' });
            return;
        }

        if (session.status !== 'active') {
            res.status(400).json({ error: 'This interview session has ended' });
            return;
        }

        // Add user message
        session.messages.push({ role: 'user', content: message, timestamp: new Date() });
        session.questionsAnswered += 1;

        // Generate AI response
        const aiResponse = await generateInterviewQuestion(
            session.topic,
            session.difficulty,
            session.type,
            session.messages.map((m) => ({ role: m.role, content: m.content }))
        );

        session.messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });
        session.questionsAsked += 1;

        // Check if interview should end (after 10 questions or user says "end")
        if (message.toLowerCase().includes('end interview') || session.questionsAsked >= 10) {
            session.status = 'completed';
            session.feedback = aiResponse;
            const scoreMatch = aiResponse.match(/(\d{1,3})\/100|score[:\s]*(\d{1,3})/i);
            if (scoreMatch) {
                session.score = parseInt(scoreMatch[1] || scoreMatch[2]);
            }
        }

        await session.save();

        res.json({ session });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/interview/history
router.get('/history', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const sessions = await InterviewSession.find({ userId: req.user!._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('-messages');

        res.json({ sessions });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/interview/:sessionId
router.get('/:sessionId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const session = await InterviewSession.findOne({
            _id: req.params.sessionId,
            userId: req.user!._id,
        });

        if (!session) {
            res.status(404).json({ error: 'Session not found' });
            return;
        }

        res.json({ session });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/interview/message  (for Voice Assistant — no session needed)
router.post('/message', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { message, topic = 'General AI & Interview Practice' } = req.body;
        if (!message) { res.status(400).json({ error: 'Message is required' }); return; }

        const reply = await generateInterviewQuestion(
            topic,
            'medium',
            'behavioral',
            [{ role: 'user', content: message }]
        );

        res.json({ message: reply });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

