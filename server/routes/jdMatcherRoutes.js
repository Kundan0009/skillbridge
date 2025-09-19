import express from 'express';
import { matchJobDescription } from '../controllers/jdMatcherController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// JD Matcher routes
router.post('/match', protect, matchJobDescription);

export default router;