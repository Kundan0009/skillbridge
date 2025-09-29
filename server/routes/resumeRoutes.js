import express from 'express';
import { analyzeResume, upload, getResumeHistory, getResumeAnalysis, testGeminiAPI } from '../controllers/resumeController.js';
import { protect, admin, optional } from '../middleware/auth.js';
import { validateFileUpload as oldValidateFileUpload } from '../middleware/security.js';
import { validateUploadedFile } from '../middleware/fileValidation.js';
import { validateFileUpload } from '../middleware/validation.js';
import { uploadRateLimit } from '../middleware/rateLimiting.js';
import { checkUsageLimit, trackUsage } from '../middleware/usageTracker.js';
import { abTestMiddleware } from '../middleware/abTesting.js';
import { trackActivity } from '../middleware/activityTracker.js';

const router = express.Router();

// Public route for resume analysis (with optional auth)
router.post('/analyze', optional, uploadRateLimit, checkUsageLimit('resume'), abTestMiddleware('resume_analysis_prompt'), upload.single('resume'), validateUploadedFile, validateFileUpload, trackActivity('resume_analysis', req => ({ filename: req.file?.sanitizedName })), analyzeResume, trackUsage);

// Public test routes
router.get('/test-ai', testGeminiAPI);
router.get('/test', protect, (req, res) => {
  res.json({ success: true, user: req.user.id, message: 'Auth working' });
});

// Protected routes
router.get('/history', protect, trackActivity('history_view'), getResumeHistory);
router.get('/:id', protect, getResumeAnalysis);

// Admin routes (removed bulk-analyze for now)

export default router;