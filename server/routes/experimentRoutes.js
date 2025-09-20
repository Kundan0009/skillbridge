import express from 'express';
import { createExperiment, startExperiment, getExperimentResults, listExperiments } from '../controllers/experimentController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin access
router.use(protect, admin);

router.post('/', createExperiment);
router.get('/', listExperiments);
router.put('/:id/start', startExperiment);
router.get('/:experimentName/results', getExperimentResults);

export default router;