import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', authenticate, dashboardController.stats);

export default router;
