import UserUsage from '../models/UserUsage.js';
import { AppError, ErrorTypes } from './errorHandler.js';

// Check usage limits middleware
export const checkUsageLimit = (feature) => {
  return async (req, res, next) => {
    if (!req.user) {
      // Anonymous users get limited access
      return next();
    }

    try {
      let usage = await UserUsage.findOne({ userId: req.user.id });
      
      if (!usage) {
        // Create usage record for new user
        usage = new UserUsage({
          userId: req.user.id,
          features: ['resume'] // Free plan default
        });
        await usage.save();
      }

      // Reset monthly usage if needed
      usage.resetMonthlyUsage();

      // Check feature access
      if (!usage.canUseFeature(feature)) {
        throw new AppError(
          `Upgrade to access ${feature}. Current plan: ${usage.plan}`,
          ErrorTypes.AUTHORIZATION_ERROR,
          403
        );
      }

      // Check analysis limits for resume feature
      if (feature === 'resume' && !usage.canAnalyze()) {
        const limits = UserUsage.PLAN_LIMITS[usage.plan];
        throw new AppError(
          `Monthly limit reached (${limits.analyses} analyses). Upgrade for more.`,
          ErrorTypes.AUTHORIZATION_ERROR,
          429
        );
      }

      req.userUsage = usage;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Track usage after successful operation
export const trackUsage = async (req, res, next) => {
  if (req.userUsage && req.method === 'POST') {
    req.userUsage.monthlyAnalyses += 1;
    req.userUsage.totalAnalyses += 1;
    await req.userUsage.save();
  }
  next();
};