import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as careerMentorController from '../controllers/careerMentor.controller';

const router = Router();

// POST /api/career-mentor/chat
router.post('/chat', authenticate, careerMentorController.chat);

export default router;
