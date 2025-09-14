import React from 'react';

const WelcomeScreen = ({ user, onGetStarted }) => {
  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to SkillBridge, {user?.name}!
        </h2>
        <p className="text-lg text-gray-600">
          Ready to supercharge your resume with AI-powered analysis?
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="font-semibold text-blue-900 mb-2">AI-Powered Analysis</h3>
          <p className="text-blue-700 text-sm">Get intelligent feedback using advanced AI technology</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-green-900 mb-2">Detailed Analytics</h3>
          <p className="text-green-700 text-sm">Track your progress with comprehensive insights</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg text-center">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-semibold text-purple-900 mb-2">ATS Optimization</h3>
          <p className="text-purple-700 text-sm">Ensure your resume passes applicant tracking systems</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">What You'll Get</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">100%</div>
            <div className="text-sm text-gray-600">Detailed Analysis</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">5+</div>
            <div className="text-sm text-gray-600">Section Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">∞</div>
            <div className="text-sm text-gray-600">Improvements</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <button
          onClick={onGetStarted}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          🚀 Upload Your First Resume
        </button>
        <p className="text-sm text-gray-500 mt-3">
          It takes less than 30 seconds to get your analysis!
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;