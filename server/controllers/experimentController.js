import { Experiment, ExperimentParticipant } from '../models/Experiment.js';
import { AppError, ErrorTypes, asyncHandler } from '../middleware/errorHandler.js';

// Create new experiment
export const createExperiment = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Admin access required', ErrorTypes.AUTHORIZATION_ERROR, 403);
  }

  const { name, description, variants, metrics, targetSampleSize } = req.body;

  // Validate allocation percentages
  const totalAllocation = variants.reduce((sum, v) => sum + v.allocation, 0);
  if (Math.abs(totalAllocation - 100) > 0.1) {
    throw new AppError('Variant allocations must sum to 100%', ErrorTypes.VALIDATION_ERROR, 400);
  }

  const experiment = await Experiment.create({
    name,
    description,
    variants,
    metrics,
    targetSampleSize
  });

  res.status(201).json({
    success: true,
    experiment
  });
});

// Start experiment
export const startExperiment = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Admin access required', ErrorTypes.AUTHORIZATION_ERROR, 403);
  }

  const experiment = await Experiment.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'active',
      startDate: new Date()
    },
    { new: true }
  );

  if (!experiment) {
    throw new AppError('Experiment not found', ErrorTypes.NOT_FOUND_ERROR, 404);
  }

  res.json({
    success: true,
    experiment
  });
});

// Get experiment results
export const getExperimentResults = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Admin access required', ErrorTypes.AUTHORIZATION_ERROR, 403);
  }

  const { experimentName } = req.params;
  
  const experiment = await Experiment.findOne({ name: experimentName });
  if (!experiment) {
    throw new AppError('Experiment not found', ErrorTypes.NOT_FOUND_ERROR, 404);
  }

  // Get participant data
  const participants = await ExperimentParticipant.find({ experimentName });
  
  // Calculate results by variant
  const results = experiment.variants.map(variant => {
    const variantParticipants = participants.filter(p => p.variant === variant.name);
    
    const metrics = {};
    experiment.metrics.forEach(metricName => {
      const metricValues = variantParticipants
        .flatMap(p => p.metrics.filter(m => m.name === metricName))
        .map(m => m.value);
      
      if (metricValues.length > 0) {
        metrics[metricName] = {
          count: metricValues.length,
          average: metricValues.reduce((sum, val) => sum + val, 0) / metricValues.length,
          values: metricValues
        };
      }
    });

    return {
      variant: variant.name,
      participants: variantParticipants.length,
      allocation: variant.allocation,
      metrics
    };
  });

  res.json({
    success: true,
    experiment: {
      name: experiment.name,
      status: experiment.status,
      totalParticipants: participants.length,
      startDate: experiment.startDate,
      results
    }
  });
});

// List all experiments
export const listExperiments = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Admin access required', ErrorTypes.AUTHORIZATION_ERROR, 403);
  }

  const experiments = await Experiment.find().sort({ createdAt: -1 });
  
  res.json({
    success: true,
    experiments
  });
});