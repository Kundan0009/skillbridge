import express from 'express';
import { generateLearningPath, getCourseRecommendations } from '../controllers/learningPathController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Learning Path routes
router.post('/generate', protect, generateLearningPath);
router.post('/courses', protect, getCourseRecommendations);

export default router;