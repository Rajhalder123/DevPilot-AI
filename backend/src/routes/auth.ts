import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authLimiter } from '../middleware/rateLimiter';
import { signupSchema, loginSchema, updateProfileSchema } from '../validators/auth.validator';
import * as authController from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/signup
router.post('/signup', authLimiter, validate(signupSchema), authController.signup);

// POST /api/auth/login
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// GET /api/auth/github — Redirect to GitHub OAuth
router.get('/github', authController.githubRedirect);

// GET /api/auth/github/callback
router.get('/github/callback', authController.githubCallback);

// GET /api/auth/me
router.get('/me', authenticate, authController.getMe);

// PUT /api/auth/profile
router.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);

export default router;
