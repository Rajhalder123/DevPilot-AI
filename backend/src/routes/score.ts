import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { aiLimiter } from '../middleware/rateLimiter';
import { fullAnalysisSchema } from '../validators/score.validator';
import * as scoreController from '../controllers/score.controller';

const router = Router();

// POST /api/score/full-analysis
// The unified "Job Readiness Intelligence Engine" endpoint.
router.post('/full-analysis', authenticate, aiLimiter, validate(fullAnalysisSchema), scoreController.fullAnalysis);

export default router;
