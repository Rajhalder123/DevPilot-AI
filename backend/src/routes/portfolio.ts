import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { aiLimiter } from '../middleware/rateLimiter';
import { generatePortfolioSchema } from '../validators/portfolio.validator';
import * as portfolioController from '../controllers/portfolio.controller';

const router = Router();

// POST /api/portfolio/generate
router.post('/generate', authenticate, aiLimiter, validate(generatePortfolioSchema), portfolioController.generate);

export default router;
