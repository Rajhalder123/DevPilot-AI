import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { aiLimiter } from '../middleware/rateLimiter';
import { analyzeGitHubSchema } from '../validators/github.validator';
import * as githubController from '../controllers/github.controller';

const router = Router();

// POST /api/github/analyze
router.post('/analyze', authenticate, aiLimiter, validate(analyzeGitHubSchema), githubController.analyze);

// GET /api/github/history
router.get('/history', authenticate, githubController.history);

export default router;
