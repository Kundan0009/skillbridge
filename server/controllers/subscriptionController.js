import UserUsage from '../models/UserUsage.js';
import { AppError, ErrorTypes, asyncHandler } from '../middleware/errorHandler.js';

// Get user's current plan and usage
export const getUserPlan = asyncHandler(async (req, res) => {
  let usage = await UserUsage.findOne({ userId: req.user.id });
  
  if (!usage) {
    usage = new UserUsage({ userId: req.user.id });
    await usage.save();
  }

  usage.resetMonthlyUsage();
  
  const limits = UserUsage.PLAN_LIMITS[usage.plan];
  
  res.json({
    success: true,
    plan: {
      current: usage.plan,
      monthlyAnalyses: usage.monthlyAnalyses,
      totalAnalyses: usage.totalAnalyses,
      limits: limits,
      features: usage.features,
      daysUntilReset: Math.ceil((usage.monthlyResetDate.getTime() + 30 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000))
    }
  });
});

// Get all available plans
export const getPlans = asyncHandler(async (req, res) => {
  const plans = UserUsage.PLAN_LIMITS;
  
  res.json({
    success: true,
    plans: Object.entries(plans).map(([name, details]) => ({
      name,
      ...details,
      recommended: name === 'basic'
    }))
  });
});

// Upgrade user plan (simplified - integrate with Stripe later)
export const upgradePlan = asyncHandler(async (req, res) => {
  const { plan } = req.body;
  
  if (!['basic', 'pro'].includes(plan)) {
    throw new AppError('Invalid plan selected', ErrorTypes.VALIDATION_ERROR, 400);
  }

  let usage = await UserUsage.findOne({ userId: req.user.id });
  if (!usage) {
    usage = new UserUsage({ userId: req.user.id });
  }

  const planDetails = UserUsage.PLAN_LIMITS[plan];
  
  usage.plan = plan;
  usage.features = planDetails.features;
  usage.subscriptionStart = new Date();
  usage.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  await usage.save();

  res.json({
    success: true,
    message: `Successfully upgraded to ${plan} plan`,
    plan: {
      current: usage.plan,
      features: usage.features,
      price: planDetails.price
    }
  });
});

// Get usage analytics for admin
export const getUsageAnalytics = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Admin access required', ErrorTypes.AUTHORIZATION_ERROR, 403);
  }

  const analytics = await UserUsage.aggregate([
    {
      $group: {
        _id: '$plan',
        count: { $sum: 1 },
        totalAnalyses: { $sum: '$totalAnalyses' },
        avgMonthlyUsage: { $avg: '$monthlyAnalyses' }
      }
    }
  ]);

  const revenue = analytics.reduce((sum, plan) => {
    const planPrice = UserUsage.PLAN_LIMITS[plan._id]?.price || 0;
    return sum + (plan.count * planPrice);
  }, 0);

  res.json({
    success: true,
    analytics: {
      planDistribution: analytics,
      estimatedMonthlyRevenue: revenue,
      totalUsers: analytics.reduce((sum, plan) => sum + plan.count, 0)
    }
  });
});