import express from 'express';
import { analyzeResume, upload, getResumeHistory, getResumeAnalysis, bulkAnalyze } from '../controllers/resumeController.js';
import { protect, admin, optional } from '../middleware/auth.js';
import { validateFileUpload as oldValidateFileUpload } from '../middleware/security.js';
import { validateUploadedFile } from '../middleware/fileValidation.js';
import { validateFileUpload } from '../middleware/validation.js';
import { uploadRateLimit } from '../middleware/rateLimiting.js';
import { trackActivity } from '../middleware/activityTracker.js';

const router = express.Router();

// Public route for resume analysis (with optional auth)
router.post('/analyze', optional, uploadRateLimit, upload.single('resume'), validateUploadedFile, validateFileUpload, trackActivity('resume_analysis', req => ({ filename: req.file?.sanitizedName })), analyzeResume);

// Protected routes
router.get('/history', protect, trackActivity('history_view'), getResumeHistory);
router.get('/:id', protect, getResumeAnalysis);

// Admin routes
router.post('/bulk-analyze', protect, admin, bulkAnalyze);

export default router;