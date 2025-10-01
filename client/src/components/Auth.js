import React, { useState } from 'react';
import api from '../utils/api.js';
import ForgotPassword from './ForgotPassword';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    department: '',
    graduationYear: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      console.log('Attempting auth:', endpoint, payload);
      console.log('API Base URL:', api.defaults.baseURL);
      
      const response = await api.post(endpoint, payload);
      
      console.log('Auth response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        onLogin(response.data);
      }
    } catch (error) {
      console.error('Auth error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      let errorMsg = 'Network Error';
      if (error.response) {
        errorMsg = error.response.data?.message || error.response.data?.error || `Server Error: ${error.response.status}`;
      } else if (error.request) {
        errorMsg = 'Cannot connect to server. Check if backend is running.';
      } else {
        errorMsg = error.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Career Growth Background */}
      <div className="absolute inset-0">
        {/* Success Path Lines */}
        <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-40 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30 animate-pulse animation-delay-2000"></div>
        
        {/* Career Icons */}
        <div className="absolute top-20 left-10 text-4xl opacity-20 animate-bounce animation-delay-500">📄</div>
        <div className="absolute top-32 right-20 text-3xl opacity-25 animate-bounce animation-delay-1500">🎯</div>
        <div className="absolute bottom-40 left-16 text-5xl opacity-15 animate-bounce animation-delay-3000">🚀</div>
        <div className="absolute bottom-20 right-10 text-4xl opacity-20 animate-bounce animation-delay-2500">💼</div>
        <div className="absolute top-1/2 left-1/4 text-3xl opacity-15 animate-bounce animation-delay-4000">📈</div>
        <div className="absolute top-1/3 right-1/3 text-4xl opacity-20 animate-bounce animation-delay-1000">🏆</div>
      </div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SkillBridge</h1>
          <h2 className="text-xl text-blue-100 mb-8">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {showForgotPassword ? (
            <ForgotPassword onBack={() => setShowForgotPassword(false)} />
          ) : (
            <>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-md border border-red-400/40 text-red-100 px-6 py-4 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      College/University
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your college name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Graduation Year
                    </label>
                    <input
                      type="number"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      min="2020"
                      max="2030"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="student">Student</option>
                      <option value="career_counselor">Career Counselor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                minLength="8"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                title="Password must contain at least 8 characters with uppercase, lowercase, number, and special character"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Strong password (8+ chars, A-z, 0-9, @$!%*?&)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

              <div className="mt-6 text-center space-y-3">
                {isLogin && (
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-200 hover:text-white text-sm transition-colors duration-200"
                  >
                    Forgot your password?
                  </button>
                )}
                <div>
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                      setFormData({
                        name: '',
                        email: '',
                        password: '',
                        college: '',
                        department: '',
                        graduationYear: '',
                        role: 'student'
                      });
                    }}
                    className="text-blue-200 hover:text-white font-medium transition-colors duration-200"
                  >
                    {isLogin 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Career Success Features */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 mt-8 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">🚀</span>
            Your Career Growth Journey Starts Here
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-green-200">
              <span className="text-green-400 mr-2">📊</span>
              AI-Powered Resume Analysis
            </div>
            <div className="flex items-center text-blue-200">
              <span className="text-blue-400 mr-2">🎯</span>
              ATS Compatibility Check
            </div>
            <div className="flex items-center text-purple-200">
              <span className="text-purple-400 mr-2">💡</span>
              Personalized Career Recommendations
            </div>
            <div className="flex items-center text-yellow-200">
              <span className="text-yellow-400 mr-2">📈</span>
              Skills Gap Analysis
            </div>
            <div className="flex items-center text-pink-200">
              <span className="text-pink-400 mr-2">📋</span>
              Resume Progress Tracking
            </div>
            <div className="flex items-center text-indigo-200">
              <span className="text-indigo-400 mr-2">🏢</span>
              Industry-Specific Insights
            </div>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 shadow-lg">
            <p className="text-white text-sm mb-1">Crafted with ❤️ by</p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-xl font-bold tracking-wide">
              KUNDAN
            </p>
            <div className="flex justify-center items-center mt-2 space-x-4 text-gray-300">
              <span className="text-xs">🚀 Full-Stack Developer</span>
              <span className="text-xs">•</span>
              <span className="text-xs">🤖 AI Enthusiast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;