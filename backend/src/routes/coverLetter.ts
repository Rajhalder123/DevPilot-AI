import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { aiLimiter } from '../middleware/rateLimiter';
import { generateCoverLetterSchema } from '../validators/coverLetter.validator';
import * as coverLetterController from '../controllers/coverLetter.controller';

const router = Router();

// POST /api/cover-letter/generate
router.post('/generate', authenticate, aiLimiter, validate(generateCoverLetterSchema), coverLetterController.generate);

export default router;
