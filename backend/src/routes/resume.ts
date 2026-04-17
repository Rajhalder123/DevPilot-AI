import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { upload } from '../middleware/upload';
import { aiLimiter } from '../middleware/rateLimiter';
import { analyzeResumeSchema, analyzeTextSchema } from '../validators/resume.validator';
import * as resumeController from '../controllers/resume.controller';

const router = Router();

// POST /api/resume/upload
router.post('/upload', authenticate, upload.single('resume'), resumeController.upload);

// POST /api/resume/analyze
router.post('/analyze', authenticate, aiLimiter, validate(analyzeResumeSchema), resumeController.analyze);

// POST /api/resume/analyze-text
router.post('/analyze-text', authenticate, aiLimiter, validate(analyzeTextSchema), resumeController.analyzeText);

// GET /api/resume/history
router.get('/history', authenticate, resumeController.history);

export default router;
