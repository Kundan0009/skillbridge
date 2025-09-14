import Resume from '../models/Resume.js';
import User from '../models/User.js';

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's resumes
    const resumes = await Resume.find({ userId }).sort({ uploadDate: -1 });
    
    if (resumes.length === 0) {
      return res.json({
        totalAnalyses: 0,
        averageScore: 0,
        improvement: 0,
        scoreHistory: [],
        sectionScores: {}
      });
    }

    // Calculate analytics
    const scores = resumes.map(r => r.analysis?.overallScore || 0);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const improvement = scores.length > 1 ? scores[0] - scores[scores.length - 1] : 0;
    
    // Get latest section scores
    const latestResume = resumes[0];
    const sectionScores = latestResume?.analysis?.sections || {};

    res.json({
      totalAnalyses: resumes.length,
      averageScore: Math.round(averageScore),
      improvement: Math.round(improvement),
      scoreHistory: scores.slice(0, 10).reverse(),
      sectionScores
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    
    // Calculate average score across all resumes
    const allResumes = await Resume.find({ 'analysis.overallScore': { $exists: true } });
    const avgScore = allResumes.length > 0 
      ? Math.round(allResumes.reduce((sum, r) => sum + r.analysis.overallScore, 0) / allResumes.length)
      : 0;

    res.json({
      totalUsers,
      totalResumes,
      averageScore: avgScore,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};