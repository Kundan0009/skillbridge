// routes/userRoutes.js

import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';
import { validateRegister, validateLogin, checkValidation } from '../middleware/security.js';
import { validateRegistration, validateLogin as newValidateLogin, validateProfileUpdate } from '../middleware/validation.js';
import { authRateLimit } from '../middleware/rateLimiting.js';
import { trackActivity } from '../middleware/activityTracker.js';

const router = express.Router();

// Public routes
router.post('/register', authRateLimit, validateRegistration, registerUser);
router.post('/login', authRateLimit, newValidateLogin, trackActivity('login'), loginUser);

// Protected routes
router.get('/profile', protect, trackActivity('dashboard_view'), getUserProfile);
router.put('/profile', protect, validateProfileUpdate, trackActivity('profile_update'), updateUserProfile);

// Admin routes
router.get('/all', protect, admin, getAllUsers);

export default router;
