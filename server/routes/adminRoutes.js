import express from 'express';
import { 
  getAdminDashboard, 
  getUserAnalytics, 
  getAIUsageStats,
  updateUserRole,
  getUserDetails
} from '../controllers/adminController.js';
import { protect, admin, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Admin dashboard
router.get('/dashboard', protect, admin, getAdminDashboard);

// User analytics
router.get('/analytics/users', protect, admin, getUserAnalytics);

// AI usage statistics
router.get('/analytics/ai-usage', protect, admin, getAIUsageStats);

// User management
router.put('/users/:userId/role', protect, admin, updateUserRole);
router.get('/users/:userId', protect, requireRole(['admin', 'counselor']), getUserDetails);

export default router;