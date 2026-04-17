import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { startInterviewSchema, respondInterviewSchema, interviewMessageSchema } from '../validators/interview.validator';
import * as interviewController from '../controllers/interview.controller';

const router = Router();

// POST /api/interview/start
router.post('/start', authenticate, validate(startInterviewSchema), interviewController.start);

// POST /api/interview/message  (Voice Assistant — no session needed)
router.post('/message', authenticate, validate(interviewMessageSchema), interviewController.message);

// POST /api/interview/:sessionId/respond
router.post('/:sessionId/respond', authenticate, validate(respondInterviewSchema), interviewController.respond);

// GET /api/interview/history
router.get('/history', authenticate, interviewController.history);

// GET /api/interview/:sessionId
router.get('/:sessionId', authenticate, interviewController.getSession);

export default router;
