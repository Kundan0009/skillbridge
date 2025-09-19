import React, { useState } from 'react';
import axios from 'axios';

const JDMatcher = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      alert('Please provide both job description and resume text');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/jd-matcher/match', {
        jobDescription,
        resumeText
      });
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('JD matching error:', error);
      alert('Failed to match job description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Job Description Matcher</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Resume Text
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleMatch}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Analyzing Match...' : 'Analyze Job Match'}
        </button>

        {analysis && (
          <div className="mt-8 space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{analysis.matchScore}%</div>
                <div className="text-sm text-gray-600">Overall Match</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{analysis.keywordMatch}%</div>
                <div className="text-sm text-gray-600">Keyword Match</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{analysis.skillsAlignment}%</div>
                <div className="text-sm text-gray-600">Skills Alignment</div>
              </div>
            </div>

            {analysis.suggestions && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-3">📝 Keywords to Add</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.suggestions.addKeywords?.map((keyword, index) => (
                      <span key={index} className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">💪 Strong Matches</h3>
                  <ul className="space-y-1">
                    {analysis.strongMatches?.map((match, index) => (
                      <li key={index} className="text-green-700 text-sm">✓ {match}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {analysis.recommendedChanges && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">🔧 Recommended Changes</h3>
                <ul className="space-y-2">
                  {analysis.recommendedChanges.map((change, index) => (
                    <li key={index} className="text-blue-700 text-sm">• {change}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JDMatcher;