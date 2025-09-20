// Clean Architecture Routes
import express from 'express';
import { resumeController } from '../../config/dependencies.js';
import { protect, optional } from '../../../middleware/auth.js';
import { upload } from '../../../controllers/resumeController.js';

const router = express.Router();

// Use clean architecture controller
router.post('/analyze', 
  optional, 
  upload.single('resume'), 
  resumeController.analyzeResume
);

router.get('/history', 
  protect, 
  resumeController.getResumeHistory
);

export default router;