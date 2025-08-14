import express from 'express';
import { analyzeResume, upload, getResumeHistory, getResumeAnalysis, bulkAnalyze } from '../controllers/resumeController.js';
import { protect, admin, optional } from '../middleware/auth.js';

const router = express.Router();

// Public route for resume analysis (with optional auth)
router.post('/analyze', optional, upload.single('resume'), analyzeResume);

// Protected routes
router.get('/history', protect, getResumeHistory);
router.get('/:id', protect, getResumeAnalysis);

// Admin routes
router.post('/bulk-analyze', protect, admin, bulkAnalyze);

export default router;