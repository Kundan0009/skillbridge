import React, { useState } from 'react';
import axios from 'axios';

const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    department: user?.department || '',
    graduationYear: user?.graduationYear || '',
    profile: {
      bio: user?.profile?.bio || '',
      linkedIn: user?.profile?.linkedIn || '',
      github: user?.profile?.github || ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [profileField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local storage
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      college: user?.college || '',
      department: user?.department || '',
      graduationYear: user?.graduationYear || '',
      profile: {
        bio: user?.profile?.bio || '',
        linkedIn: user?.profile?.linkedIn || '',
        github: user?.profile?.github || ''
      }
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">👤</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">User Profile</h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Edit Profile
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-8 p-6 rounded-2xl backdrop-blur-md shadow-lg ${
          message.includes('successfully') 
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-800 border border-green-400/40'
            : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-800 border border-red-400/40'
        }`}>
          <div className="flex items-center justify-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.includes('successfully')
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              <span className="text-sm font-bold">
                {message.includes('successfully') ? '✓' : '!'}
              </span>
            </div>
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-40 relative">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-600">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-16 p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

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
                  />
                </div>

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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={user?.role || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 capitalize"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="profile.bio"
                  value={formData.profile.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="profile.linkedIn"
                    value={formData.profile.linkedIn}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="profile.github"
                    value={formData.profile.github}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-md font-medium ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Display Mode */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-gray-600">{user?.email}</p>
                {user?.role && (
                  <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'career_counselor' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role.replace('_', ' ').toUpperCase()}
                  </span>
                )}
              </div>

              {/* Academic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900">College</h4>
                  <p className="text-gray-600">{user?.college || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Department</h4>
                  <p className="text-gray-600">{user?.department || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Graduation Year</h4>
                  <p className="text-gray-600">{user?.graduationYear || 'Not specified'}</p>
                </div>
              </div>

              {/* Bio */}
              {user?.profile?.bio && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600">{user.profile.bio}</p>
                </div>
              )}

              {/* Social Links */}
              {(user?.profile?.linkedIn || user?.profile?.github) && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Social Links</h4>
                  <div className="flex space-x-4">
                    {user.profile.linkedIn && (
                      <a
                        href={user.profile.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <span className="mr-2">💼</span>
                        LinkedIn
                      </a>
                    )}
                    {user.profile.github && (
                      <a
                        href={user.profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-800 hover:text-gray-600"
                      >
                        <span className="mr-2">🐙</span>
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Account Information */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
                <div className="text-sm text-gray-600">
                  <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;