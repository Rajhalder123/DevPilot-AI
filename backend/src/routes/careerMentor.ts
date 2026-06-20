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

// DELETE /api/career-mentor/conversations/:id
router.delete('/conversations/:id', careerMentorController.deleteConversation);

// PATCH /api/career-mentor/conversations/:id  (rename)
router.patch('/conversations/:id', careerMentorController.renameConversation);

export default router;
