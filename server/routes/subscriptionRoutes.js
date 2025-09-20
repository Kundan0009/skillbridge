import express from 'express';
import { getUserPlan, getPlans, upgradePlan, getUsageAnalytics } from '../controllers/subscriptionController.js';
import { protect, admin } from '../middleware/auth.js';
import { trackActivity } from '../middleware/activityTracker.js';

const router = express.Router();

// Public routes
router.get('/plans', getPlans);

// Protected routes
router.get('/my-plan', protect, getUserPlan);
router.post('/upgrade', protect, trackActivity('plan_upgrade'), upgradePlan);

// Admin routes
router.get('/analytics', protect, admin, getUsageAnalytics);

export default router;