import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { aiLimiter } from '../middleware/rateLimiter';
import { generateRoadmapSchema } from '../validators/roadmap.validator';
import * as roadmapController from '../controllers/roadmap.controller';

const router = Router();

// POST /api/roadmap/generate
router.post('/generate', authenticate, aiLimiter, validate(generateRoadmapSchema), roadmapController.generate);

export default router;
