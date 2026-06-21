import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import * as adminController from '../controllers/admin.controller';

const router = Router();

// Protect all routes with auth and admin middlewares
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/stats', adminController.getDashboardStats);
router.get('/analytics/growth', adminController.getGrowthAnalytics);

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetail);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/role', adminController.updateUserRole);
router.patch('/users/:id/suspend', adminController.suspendUser);

// Content — Resumes
router.get('/content/resumes', adminController.getAllResumes);
router.get('/content/resumes/:id', adminController.getResumeDetail);
router.delete('/content/resumes/:id', adminController.deleteResume);

// Content — Conversations
router.get('/content/conversations', adminController.getAllConversations);
router.get('/content/conversations/:id', adminController.getConversationDetail);
router.delete('/content/conversations/:id', adminController.deleteConversation);

// Content — Interviews
router.get('/content/interviews', adminController.getAllInterviews);
router.get('/content/interviews/:id', adminController.getInterviewDetail);
router.delete('/content/interviews/:id', adminController.deleteInterview);

export default router;
