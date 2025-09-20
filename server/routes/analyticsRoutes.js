import express from 'express';
import { getAnalyticsDashboard, getUserAnalytics } from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/auth.js';
import { trackActivity } from '../middleware/activityTracker.js';

const router = express.Router();

// User analytics
router.get('/user', protect, trackActivity('analytics_view'), getUserAnalytics);

// Admin analytics dashboard
router.get('/dashboard', protect, admin, getAnalyticsDashboard);

export default router;