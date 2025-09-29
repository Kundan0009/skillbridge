import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';

const ResumeHistory = ({ user, onViewAnalysis }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumeHistory();
  }, []);

  const fetchResumeHistory = async () => {
    try {
      const response = await api.get('/api/resumes/history');
      setResumes(response.data.resumes);
    } catch (error) {
      setError('Failed to fetch resume history');
      console.error('Error fetching resume history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalysis = async (resumeId) => {
    try {
      const response = await api.get(`/api/resumes/${resumeId}`);
      onViewAnalysis(response.data.resume.analysis);
    } catch (error) {
      console.error('Error fetching resume analysis:', error);
      alert('Failed to load analysis');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading resume history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume History</h2>
        <p className="text-gray-600">
          View and compare your previous resume analyses.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No resumes analyzed yet
          </h3>
          <p className="text-gray-500 mb-6">
            Upload your first resume to get started with AI-powered analysis.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900 mr-4">
                      {resume.originalName}
                    </h3>
                    {resume.analysis?.overallScore && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(resume.analysis.overallScore)}`}>
                        {resume.analysis.overallScore}/100
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>📅 {new Date(resume.uploadDate).toLocaleDateString()}</span>
                    <span>🕒 {new Date(resume.uploadDate).toLocaleTimeString()}</span>
                  </div>

                  {resume.analysis && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {resume.analysis.overallScore || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">Overall Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {resume.analysis.atsScore || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">ATS Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          {resume.analysis.strengths?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Strengths</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600">
                          {resume.analysis.improvements?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Improvements</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <button
                    onClick={() => handleViewAnalysis(resume._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    View Analysis
                  </button>
                  
                  {resume.analysis?.industryMatch && (
                    <div className="text-xs text-gray-500 text-center">
                      🎯 {resume.analysis.industryMatch}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Preview of Key Insights */}
              {resume.analysis && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {resume.analysis.strengths?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-green-800 mb-1">Top Strength:</h4>
                        <p className="text-green-700">{resume.analysis.strengths[0]}</p>
                      </div>
                    )}
                    {resume.analysis.improvements?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">Key Improvement:</h4>
                        <p className="text-red-700">{resume.analysis.improvements[0]}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Statistics Summary */}
      {resumes.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {resumes.length}
              </div>
              <div className="text-sm text-gray-600">Total Analyses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  resumes.reduce((sum, r) => sum + (r.analysis?.overallScore || 0), 0) / resumes.length
                )}
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.max(...resumes.map(r => r.analysis?.overallScore || 0))}
              </div>
              <div className="text-sm text-gray-600">Best Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeHistory;