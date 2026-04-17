import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as jobsController from '../controllers/jobs.controller';

const router = Router();

// GET /api/jobs/search
router.get('/search', authenticate, jobsController.search);

export default router;
