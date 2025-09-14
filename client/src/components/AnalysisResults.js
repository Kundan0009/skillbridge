import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const AnimatedScore = ({ score, duration = 2000 }) => {
  const [displayScore, setDisplayScore] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = score / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [score, duration]);
  
  return <span>{displayScore}</span>;
};

const AnalysisResults = ({ analysis }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const downloadPDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.text('Resume Analysis Report', 20, yPosition);
    yPosition += 20;

    // Overall Score
    doc.setFontSize(16);
    doc.text(`Overall Score: ${analysis.overallScore}/100`, 20, yPosition);
    yPosition += 10;
    doc.text(`ATS Score: ${analysis.atsScore}/100`, 20, yPosition);
    yPosition += 20;

    // Strengths
    if (analysis.strengths?.length > 0) {
      doc.setFontSize(14);
      doc.text('Strengths:', 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      analysis.strengths.forEach((strength, index) => {
        doc.text(`• ${strength}`, 25, yPosition);
        yPosition += 8;
      });
      yPosition += 10;
    }

    // Improvements
    if (analysis.improvements?.length > 0) {
      doc.setFontSize(14);
      doc.text('Areas for Improvement:', 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      analysis.improvements.forEach((improvement, index) => {
        doc.text(`• ${improvement}`, 25, yPosition);
        yPosition += 8;
      });
    }

    doc.save('resume-analysis-report.pdf');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Resume Analysis Results</h2>
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <span className="mr-2">📄</span>
          Download Report
        </button>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold"><AnimatedScore score={analysis.overallScore} />/100</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore >= 80 ? 'Excellent' : 
               analysis.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${getScoreBarColor(analysis.overallScore)}`}
              style={{ width: `${analysis.overallScore}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">ATS Compatibility</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold"><AnimatedScore score={analysis.atsScore} />/100</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.atsScore)}`}>
              {analysis.atsScore >= 80 ? 'ATS Friendly' : 
               analysis.atsScore >= 60 ? 'Moderate' : 'Poor ATS Score'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${getScoreBarColor(analysis.atsScore)}`}
              style={{ width: `${analysis.atsScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'sections', name: 'Section Analysis', icon: '📝' },
            { id: 'keywords', name: 'Keywords', icon: '🔍' },
            { id: 'recommendations', name: 'Recommendations', icon: '💡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
              <span className="mr-2">✅</span>
              Strengths
            </h3>
            {analysis.strengths?.length > 0 ? (
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="text-green-700 flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-600">No specific strengths identified.</p>
            )}
          </div>

          {/* Areas for Improvement */}
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <span className="mr-2">⚠️</span>
              Areas for Improvement
            </h3>
            {analysis.improvements?.length > 0 ? (
              <ul className="space-y-2">
                {analysis.improvements.map((improvement, index) => (
                  <li key={index} className="text-red-700 flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-red-600">No specific improvements suggested.</p>
            )}
          </div>
        </div>
      )}

      {activeSection === 'sections' && analysis.sections && (
        <div className="space-y-6">
          {Object.entries(analysis.sections).map(([sectionName, sectionData]) => (
            <div key={sectionName} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold capitalize">{sectionName}</h3>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-2">{sectionData.score}/100</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getScoreBarColor(sectionData.score)}`}
                      style={{ width: `${sectionData.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{sectionData.feedback}</p>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'keywords' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Found Keywords */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-800">
              Found Keywords
            </h3>
            {analysis.keywords?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No keywords identified.</p>
            )}
          </div>

          {/* Missing Keywords */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-800">
              Suggested Keywords
            </h3>
            {analysis.missingKeywords?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No additional keywords suggested.</p>
            )}
          </div>
        </div>
      )}

      {activeSection === 'recommendations' && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
          {analysis.recommendations?.length > 0 ? (
            <div className="space-y-4">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mr-3 mt-1">💡</span>
                  <p className="text-blue-800">{recommendation}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No specific recommendations available.</p>
          )}
          
          {analysis.industryMatch && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Industry Match</h4>
              <p className="text-purple-700">{analysis.industryMatch}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;