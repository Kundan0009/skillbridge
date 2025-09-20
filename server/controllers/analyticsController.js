import User from '../models/User.js';
import UserUsage from '../models/UserUsage.js';
import Resume from '../models/Resume.js';
import UserActivity from '../models/UserActivity.js';
import { AppError, ErrorTypes, asyncHandler } from '../middleware/errorHandler.js';

// Calculate user retention rates
const calculateRetention = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const totalUsers = await User.countDocuments();
  const activeUsers30d = await UserActivity.distinct('userId', { 
    timestamp: { $gte: thirtyDaysAgo } 
  });
  const activeUsers7d = await UserActivity.distinct('userId', { 
    timestamp: { $gte: sevenDaysAgo } 
  });
  
  return {
    total: totalUsers,
    active30d: activeUsers30d.length,
    active7d: activeUsers7d.length,
    retention30d: totalUsers > 0 ? (activeUsers30d.length / totalUsers * 100).toFixed(1) : 0,
    retention7d: totalUsers > 0 ? (activeUsers7d.length / totalUsers * 100).toFixed(1) : 0
  };
};

// Get feature usage statistics
const getFeatureStats = async () => {
  const featureUsage = await UserActivity.aggregate([
    { $group: { _id: '$action', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  return featureUsage.map(item => ({
    feature: item._id,
    usage: item.count
  }));
};

// Calculate conversion rate (free to paid)
const getConversionRate = async () => {
  const totalUsers = await User.countDocuments();
  const paidUsers = await UserUsage.countDocuments({ 
    plan: { $in: ['basic', 'pro'] } 
  });
  
  const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers * 100).toFixed(1) : 0;
  
  return {
    totalUsers,
    paidUsers,
    freeUsers: totalUsers - paidUsers,
    conversionRate: parseFloat(conversionRate)
  };
};

// Predict churn based on activity
const predictChurn = async () => {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  
  const inactiveUsers = await User.aggregate([
    {
      $lookup: {
        from: 'useractivities',
        localField: '_id',
        foreignField: 'userId',
        as: 'activities'
      }
    },
    {
      $match: {
        $or: [
          { activities: { $size: 0 } },
          { 'activities.timestamp': { $lt: fourteenDaysAgo } }
        ]
      }
    },
    { $count: 'churnRisk' }
  ]);
  
  const totalUsers = await User.countDocuments();
  const churnRiskCount = inactiveUsers[0]?.churnRisk || 0;
  
  return {
    totalUsers,
    churnRisk: churnRiskCount,
    churnRate: totalUsers > 0 ? (churnRiskCount / totalUsers * 100).toFixed(1) : 0
  };
};

// Get comprehensive analytics dashboard
export const getAnalyticsDashboard = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Admin access required', ErrorTypes.AUTHORIZATION_ERROR, 403);
  }

  const [retention, featureUsage, conversion, churn] = await Promise.all([
    calculateRetention(),
    getFeatureStats(),
    getConversionRate(),
    predictChurn()
  ]);

  // Revenue calculation
  const revenueData = await UserUsage.aggregate([
    { $match: { plan: { $in: ['basic', 'pro'] } } },
    {
      $group: {
        _id: '$plan',
        count: { $sum: 1 }
      }
    }
  ]);

  const monthlyRevenue = revenueData.reduce((sum, plan) => {
    const price = plan._id === 'basic' ? 9.99 : 19.99;
    return sum + (plan.count * price);
  }, 0);

  res.json({
    success: true,
    analytics: {
      userRetention: retention,
      featureUsage,
      conversionRate: conversion,
      churnPrediction: churn,
      revenue: {
        monthly: monthlyRevenue.toFixed(2),
        annual: (monthlyRevenue * 12).toFixed(2),
        breakdown: revenueData
      }
    }
  });
});

// Get user-specific analytics
export const getUserAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const userUsage = await UserUsage.findOne({ userId });
  const userActivities = await UserActivity.find({ userId })
    .sort({ timestamp: -1 })
    .limit(50);
  
  const resumeCount = await Resume.countDocuments({ userId });
  
  // Calculate user engagement score
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentActivities = userActivities.filter(
    activity => activity.timestamp >= thirtyDaysAgo
  );
  
  const engagementScore = Math.min(recentActivities.length * 2, 100);
  
  res.json({
    success: true,
    analytics: {
      plan: userUsage?.plan || 'free',
      totalAnalyses: userUsage?.totalAnalyses || 0,
      monthlyAnalyses: userUsage?.monthlyAnalyses || 0,
      resumeCount,
      engagementScore,
      recentActivities: recentActivities.slice(0, 10),
      joinDate: req.user.createdAt
    }
  });
});