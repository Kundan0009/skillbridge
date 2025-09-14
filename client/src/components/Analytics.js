import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Analytics = ({ user }) => {
  const [analytics, setAnalytics] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    improvement: 0,
    scoreHistory: [],
    sectionScores: {}
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/resumes/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const resumes = response.data.resumes;
      if (resumes.length > 0) {
        const scores = resumes.map(r => r.analysis?.overallScore || 0);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const improvement = scores.length > 1 ? scores[0] - scores[scores.length - 1] : 0;
        
        setAnalytics({
          totalAnalyses: resumes.length,
          averageScore: Math.round(avgScore),
          improvement: Math.round(improvement),
          scoreHistory: scores.slice(0, 10).reverse(),
          sectionScores: resumes[0]?.analysis?.sections || {}
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const ScoreChart = ({ scores }) => {
    const maxScore = Math.max(...scores, 100);
    return (
      <div className="flex items-end space-x-2 h-32">
        {scores.map((score, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="bg-blue-500 rounded-t w-6 transition-all duration-500"
              style={{ height: `${(score / maxScore) * 100}%` }}
            ></div>
            <span className="text-xs text-gray-500 mt-1">{index + 1}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Analytics Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="text-3xl font-bold">{analytics.totalAnalyses}</div>
          <div className="text-blue-100">Total Analyses</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="text-3xl font-bold">{analytics.averageScore}%</div>
          <div className="text-green-100">Average Score</div>
        </div>
        
        <div className={`bg-gradient-to-r ${analytics.improvement >= 0 ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600'} text-white p-6 rounded-lg`}>
          <div className="text-3xl font-bold">
            {analytics.improvement >= 0 ? '+' : ''}{analytics.improvement}%
          </div>
          <div className={analytics.improvement >= 0 ? 'text-purple-100' : 'text-red-100'}>
            Improvement
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <div className="text-3xl font-bold">
            {Math.max(...Object.values(analytics.sectionScores).map(s => s.score || 0))}%
          </div>
          <div className="text-orange-100">Best Section</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Progress */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">📈 Score Progress</h3>
          {analytics.scoreHistory.length > 0 ? (
            <ScoreChart scores={analytics.scoreHistory} />
          ) : (
            <div className="text-center text-gray-500 py-8">No data available</div>
          )}
        </div>

        {/* Section Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">🎯 Section Scores</h3>
          <div className="space-y-3">
            {Object.entries(analytics.sectionScores).map(([section, data]) => (
              <div key={section}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{section}</span>
                  <span>{data.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${data.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;