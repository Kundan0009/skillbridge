import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResumeUpload from './ResumeUpload';
import ResumeHistory from './ResumeHistory';
import AnalysisResults from './AnalysisResults';
import UserProfile from './UserProfile';
import Analytics from './Analytics';
import WelcomeScreen from './WelcomeScreen';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [showWelcome, setShowWelcome] = useState(!localStorage.getItem('hasVisited'));

  const tabs = [
    { id: 'upload', name: 'Upload Resume', icon: '📄' },
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
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

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

  const fetchStats = async () => {
    // Implement stats fetching
    setStats({
      totalUsers: users.length,
      totalResumes: 0,
      averageScore: 0
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Total Resumes</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalResumes}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Avg Score</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.averageScore}%</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Registered Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.college || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'career_counselor' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;