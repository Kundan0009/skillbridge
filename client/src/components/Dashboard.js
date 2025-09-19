import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResumeUpload from './ResumeUpload';
import ResumeHistory from './ResumeHistory';
import AnalysisResults from './AnalysisResults';
import UserProfile from './UserProfile';
import Analytics from './Analytics';
import WelcomeScreen from './WelcomeScreen';
import JDMatcher from './JDMatcher';
import InterviewBot from './InterviewBot';
import LearningPath from './LearningPath';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [showWelcome, setShowWelcome] = useState(!localStorage.getItem('hasVisited'));

  const tabs = [
    { id: 'upload', name: 'Resume Analyzer', icon: '📄' },
    { id: 'jd-matcher', name: 'JD Matcher', icon: '🎯' },
    { id: 'interview-bot', name: 'Interview Bot', icon: '🤖' },
    { id: 'learning-path', name: 'Learning Path', icon: '🗺️' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'history', name: 'History', icon: '📋' },
    { id: 'profile', name: 'Profile', icon: '👤' },
    ...(user?.role === 'admin' ? [{ id: 'admin', name: 'Admin Panel', icon: '⚙️' }] : [])
  ];

  const handleAnalysisComplete = (analysis) => {
    setCurrentAnalysis(analysis);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SkillBridge</h1>
              <span className="ml-2 text-sm text-gray-500">Resume Analyzer</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
                {user?.college && (
                  <span className="text-gray-500"> • {user.college}</span>
                )}
              </span>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.name}
                    </button>
                  </li>
                ))}
                {currentAnalysis && (
                  <li>
                    <button
                      onClick={() => setActiveTab('results')}
                      className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors ${
                        activeTab === 'results'
                          ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">📈</span>
                      Latest Results
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              {activeTab === 'welcome' && showWelcome && (
                <WelcomeScreen 
                  user={user} 
                  onGetStarted={() => {
                    localStorage.setItem('hasVisited', 'true');
                    setShowWelcome(false);
                    setActiveTab('upload');
                  }}
                />
              )}
              {activeTab === 'upload' && (
                <ResumeUpload 
                  user={user} 
                  onAnalysisComplete={handleAnalysisComplete}
                />
              )}
              {activeTab === 'jd-matcher' && (
                <JDMatcher />
              )}
              {activeTab === 'interview-bot' && (
                <InterviewBot />
              )}
              {activeTab === 'learning-path' && (
                <LearningPath />
              )}
              {activeTab === 'analytics' && (
                <Analytics user={user} />
              )}
              {activeTab === 'history' && (
                <ResumeHistory 
                  user={user}
                  onViewAnalysis={(analysis) => {
                    setCurrentAnalysis(analysis);
                    setActiveTab('results');
                  }}
                />
              )}
              {activeTab === 'profile' && (
                <UserProfile user={user} />
              )}
              {activeTab === 'results' && currentAnalysis && (
                <AnalysisResults analysis={currentAnalysis} />
              )}
              {activeTab === 'admin' && user?.role === 'admin' && (
                <AdminPanel />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [userAnalytics, setUserAnalytics] = useState({});
  // const [selectedUser, setSelectedUser] = useState(null); // Removed unused variable
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
    fetchUserAnalytics();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchUserAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/analytics/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user analytics:', error);
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/users/${userId}/role`, 
        { userId, role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading admin dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🛡️ Admin Dashboard</h2>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'users', name: 'User Management', icon: '👥' },
            { id: 'analytics', name: 'Analytics', icon: '📈' },
            { id: 'ai-usage', name: 'AI Usage', icon: '🤖' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-3xl font-bold">{dashboardData.totalUsers || 0}</p>
              <p className="text-blue-100 text-sm">+{dashboardData.userStats?.newUsers || 0} this month</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold">Total Resumes</h3>
              <p className="text-3xl font-bold">{dashboardData.totalResumes || 0}</p>
              <p className="text-green-100 text-sm">AI Analyses</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold">Active Users</h3>
              <p className="text-3xl font-bold">{dashboardData.userStats?.activeUsers || 0}</p>
              <p className="text-purple-100 text-sm">Last 30 days</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold">Avg AI Score</h3>
              <p className="text-3xl font-bold">{Math.round(dashboardData.aiUsageStats?.averageScore || 0)}%</p>
              <p className="text-orange-100 text-sm">Resume Quality</p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Recent Activities</h3>
            </div>
            <div className="p-6">
              {dashboardData.recentActivities?.map((activity, index) => (
                <div key={index} className="flex items-center py-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm">
                    <strong>{activity.userId?.name}</strong> {activity.action.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              )) || <p className="text-gray-500">No recent activities</p>}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.college || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800 border-red-200' :
                          user.role === 'counselor' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-green-100 text-green-800 border-green-200'
                        }`}
                      >
                        <option value="student">Student</option>
                        <option value="counselor">Counselor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => console.log('View user:', user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
            {userAnalytics.userEngagement?.map((user, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <div>
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({user.email})</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{user.totalActions} actions</div>
                  <div className="text-xs text-gray-500">
                    Last: {new Date(user.lastActivity).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )) || <p className="text-gray-500">No engagement data available</p>}
          </div>
        </div>
      )}

      {/* AI Usage Tab */}
      {activeTab === 'ai-usage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Total AI Analyses</h3>
              <p className="text-3xl font-bold text-blue-600">
                {dashboardData.aiUsageStats?.totalAnalyses || 0}
              </p>
              <p className="text-sm text-gray-500">Last 30 days</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Average Score</h3>
              <p className="text-3xl font-bold text-green-600">
                {Math.round(dashboardData.aiUsageStats?.averageScore || 0)}%
              </p>
              <p className="text-sm text-gray-500">Resume quality</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Daily Usage</h3>
              <div className="text-sm text-gray-600">
                {dashboardData.aiUsageStats?.dailyUsage?.length || 0} active days
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;