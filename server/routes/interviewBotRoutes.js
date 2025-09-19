import express from 'express';
import { startInterview, continueInterview, endInterview } from '../controllers/interviewBotController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Interview Bot routes
router.post('/start', protect, startInterview);
router.post('/continue', protect, continueInterview);
router.post('/end', protect, endInterview);

export default router;