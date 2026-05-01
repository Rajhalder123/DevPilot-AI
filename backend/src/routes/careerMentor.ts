import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as careerMentorController from '../controllers/careerMentor.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// POST /api/career-mentor/chat
router.post('/chat', careerMentorController.chat);

// GET /api/career-mentor/conversations
router.get('/conversations', careerMentorController.getConversations);

// GET /api/career-mentor/history/:id
router.get('/history/:id', careerMentorController.getHistory);

export default router;
