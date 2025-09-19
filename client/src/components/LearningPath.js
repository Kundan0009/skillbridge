import React, { useState } from 'react';
import axios from 'axios';

const LearningPath = () => {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [currentLevel, setCurrentLevel] = useState('Intermediate');
  const [timeframe, setTimeframe] = useState('6 months');
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePath = async () => {
    if (!resumeText.trim()) {
      alert('Please provide your resume text');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/learning-path/generate', {
        resumeText,
        targetRole,
        currentLevel,
        timeframe
      });
      setLearningPath(response.data.learningPath);
    } catch (error) {
      console.error('Learning path generation error:', error);
      alert('Failed to generate learning path. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PhaseCard = ({ phase, title, index }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
          {index + 1}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{phase.title}</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Duration:</span>
          {phase.estimatedTime}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Priority:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            phase.priority === 'High' ? 'bg-red-100 text-red-800' :
            phase.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {phase.priority}
          </span>
        </div>
        
        <div>
          <span className="font-medium text-sm text-gray-600 block mb-2">Skills to Learn:</span>
          <div className="flex flex-wrap gap-2">
            {phase.skills?.map((skill, skillIndex) => (
              <span key={skillIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Learning Path Generator</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Full Stack Developer</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Data Scientist</option>
                <option>DevOps Engineer</option>
                <option>Mobile Developer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Level
              </label>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>3 months</option>
                <option>6 months</option>
                <option>12 months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Resume/Skills Text
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text or describe your current skills..."
              className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={generatePath}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating Learning Path...' : 'Generate Personalized Learning Path'}
        </button>

        {learningPath && (
          <div className="mt-8 space-y-8">
            {/* Skill Gap Analysis */}
            {learningPath.skillGapAnalysis && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Skill Gap Analysis</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">✅ Current Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {learningPath.skillGapAnalysis.currentSkills?.map((skill, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">🎯 Skills to Learn</h4>
                    <div className="flex flex-wrap gap-2">
                      {learningPath.skillGapAnalysis.skillGaps?.map((skill, index) => (
                        <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Learning Path Phases */}
            {learningPath.learningPath && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">🗺️ Your Learning Journey</h3>
                <div className="space-y-4">
                  {Object.entries(learningPath.learningPath).map(([key, phase], index) => (
                    <PhaseCard key={key} phase={phase} title={key} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Practice Projects */}
            {learningPath.practiceProjects && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">🛠️ Practice Projects</h3>
                <ul className="space-y-2">
                  {learningPath.practiceProjects.map((project, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-blue-700">{project}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success Metrics */}
            {learningPath.successMetrics && (
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-4">🎯 Success Metrics</h3>
                <ul className="space-y-2">
                  {learningPath.successMetrics.map((metric, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-green-700">{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            {learningPath.timeline && (
              <div className="text-center bg-purple-50 rounded-lg p-4">
                <div className="text-lg font-semibold text-purple-800">
                  📅 Estimated Timeline: {learningPath.timeline}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPath;