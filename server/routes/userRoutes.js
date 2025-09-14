// routes/userRoutes.js

import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';
import { validateRegister, validateLogin, checkValidation } from '../middleware/security.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, checkValidation, registerUser);
router.post('/login', validateLogin, checkValidation, loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin routes
router.get('/all', protect, admin, getAllUsers);

export default router;
