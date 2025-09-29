import React, { useState } from 'react';
import api from '../utils/api';

const ForgotPassword = ({ onBack }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/api/users/forgot-password', { email });
      setMessage('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await api.post('/api/users/reset-password', {
        email,
        otp,
        newPassword
      });
      setMessage('Password reset successfully!');
      setStep(3);
      setTimeout(() => onBack(), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Reset Password</h3>
        <p className="text-blue-100">
          {step === 1 && "Enter your email to receive OTP"}
          {step === 2 && "Enter the OTP sent to your email"}
          {step === 3 && "Password reset successful!"}
        </p>
      </div>

      {message && (
        <div className={`p-6 rounded-2xl text-center backdrop-blur-md ${
          message.includes('success') || message.includes('sent')
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-100 border border-green-400/40 shadow-lg'
            : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-100 border border-red-400/40 shadow-lg'
        }`}>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">
              {message.includes('success') || message.includes('sent') ? '✓' : '⚠️'}
            </span>
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength="6"
              required
            />
            <p className="text-xs text-blue-200 mt-1">Check your email for the 6-digit code</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm new password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
            <span className="text-white text-4xl">✓</span>
          </div>
          <div className="bg-gradient-to-r from-green-100/20 to-emerald-100/20 rounded-2xl p-6 border border-green-300/30">
            <p className="text-green-200 text-xl font-semibold mb-2">Password Reset Successful!</p>
            <p className="text-green-300 text-sm">Your password has been updated securely</p>
            <p className="text-blue-200 text-sm mt-3">Redirecting to login in 2 seconds...</p>
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full text-blue-200 hover:text-white transition-colors duration-200 text-sm"
      >
        ← Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;