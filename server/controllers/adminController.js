import User from '../models/User.js';
import Resume from '../models/Resume.js';
import UserActivity from '../models/UserActivity.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalResumes,
      userStats,
      aiUsageStats
    ] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      getUserStatistics(),
      getAIUsageStatistics()
    ]);

    // Get recent activities (simplified)
    const recentActivities = await Resume.find()
      .sort({ uploadDate: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .select('userId uploadDate originalName');

    const formattedActivities = recentActivities.map(resume => ({
      userId: resume.userId,
      action: 'resume_analysis',
      timestamp: resume.uploadDate,
      details: { filename: resume.originalName }
    }));

    res.json({
      totalUsers,
      totalResumes,
      recentActivities: formattedActivities,
      userStats,
      aiUsageStats
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch admin dashboard data' });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Simplified analytics based on resume uploads
    const userEngagement = await Resume.aggregate([
      { $match: { uploadDate: { $gte: startDate } } },
      {
        $group: {
          _id: '$userId',
          totalActions: { $sum: 1 },
          lastActivity: { $max: '$uploadDate' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          totalActions: 1,
          lastActivity: 1
        }
      },
      { $sort: { totalActions: -1 } },
      { $limit: 20 }
    ]);

    res.json({ userEngagement });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
};

export const getAIUsageStats = async (req, res) => {
  try {
    const stats = await getAIUsageStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI usage stats' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    if (!['student', 'counselor', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [user, resumeCount, recentActivity] = await Promise.all([
      User.findById(userId).select('-password'),
      Resume.countDocuments({ userId }),
      UserActivity.find({ userId }).sort({ timestamp: -1 }).limit(10)
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user, resumeCount, recentActivity });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

// Helper functions
async function getUserStatistics() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const [newUsers, activeUsers, roleDistribution] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Resume.distinct('userId', { uploadDate: { $gte: thirtyDaysAgo } }).then(ids => ids.length),
    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ])
  ]);

  return { newUsers, activeUsers, roleDistribution };
}

async function getAIUsageStatistics() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const [totalAnalyses, dailyUsage, avgScore] = await Promise.all([
    Resume.countDocuments({ uploadDate: { $gte: thirtyDaysAgo } }),
    Resume.aggregate([
      { $match: { uploadDate: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$uploadDate' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]),
    Resume.aggregate([
      { $match: { 'analysis.overallScore': { $exists: true } } },
      { $group: { _id: null, avgScore: { $avg: '$analysis.overallScore' } } }
    ])
  ]);

  return {
    totalAnalyses,
    dailyUsage,
    averageScore: avgScore[0]?.avgScore || 0
  };
}