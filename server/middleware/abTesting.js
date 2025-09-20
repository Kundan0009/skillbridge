import { Experiment, ExperimentParticipant } from '../models/Experiment.js';

// Assign user to experiment variant
export const assignVariant = async (experimentName, userId = null, sessionId = null) => {
  try {
    const experiment = await Experiment.findOne({ 
      name: experimentName, 
      status: 'active' 
    });
    
    if (!experiment) {
      return { variant: 'control', config: {} };
    }

    // Check if user already assigned
    const existing = await ExperimentParticipant.findOne({
      $or: [
        { userId, experimentName },
        { sessionId, experimentName }
      ]
    });

    if (existing) {
      const variant = experiment.variants.find(v => v.name === existing.variant);
      return {
        variant: existing.variant,
        config: variant?.config || {}
      };
    }

    // Assign new variant based on allocation
    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedVariant = experiment.variants[0];

    for (const variant of experiment.variants) {
      cumulative += variant.allocation;
      if (random <= cumulative) {
        selectedVariant = variant;
        break;
      }
    }

    // Save assignment
    await ExperimentParticipant.create({
      userId,
      sessionId,
      experimentName,
      variant: selectedVariant.name
    });

    return {
      variant: selectedVariant.name,
      config: selectedVariant.config || {}
    };
  } catch (error) {
    console.error('A/B Testing Error:', error);
    return { variant: 'control', config: {} };
  }
};

// Record experiment metric
export const recordMetric = async (experimentName, userId, sessionId, metricName, value) => {
  try {
    await ExperimentParticipant.updateOne(
      {
        $or: [
          { userId, experimentName },
          { sessionId, experimentName }
        ]
      },
      {
        $push: {
          metrics: {
            name: metricName,
            value,
            recordedAt: new Date()
          }
        }
      }
    );
  } catch (error) {
    console.error('Metric Recording Error:', error);
  }
};

// A/B testing middleware
export const abTestMiddleware = (experimentName) => {
  return async (req, res, next) => {
    const userId = req.user?.id;
    const sessionId = req.sessionID || req.ip;
    
    const assignment = await assignVariant(experimentName, userId, sessionId);
    
    req.abTest = {
      experiment: experimentName,
      variant: assignment.variant,
      config: assignment.config,
      recordMetric: (metricName, value) => 
        recordMetric(experimentName, userId, sessionId, metricName, value)
    };
    
    next();
  };
};