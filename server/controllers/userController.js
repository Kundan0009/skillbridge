// controllers/userController.js

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppError, ErrorTypes, asyncHandler } from '../middleware/errorHandler.js';
import { sendWelcomeEmail, sendPasswordResetOTP } from '../utils/emailService.js';
import PasswordReset from '../models/PasswordReset.js';

// Generate JWT token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// @route   POST /api/users/register
export const registerUser = async (req, res) => {
  console.log('Registration request received:', req.body);
  try {
    const { name, email, password, college, department, graduationYear, role } = req.body;

    console.log('Processing registration for:', email);

    if (!name || !email || !password) {
      console.log('Validation failed: missing required fields');
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Strong password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Password must contain uppercase, lowercase, number, and special character' 
      });
    }

    console.log('Checking if user exists...');
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    console.log('Creating new user...');
    const user = await User.create({
      name,
      email,
      password,
      college,
      department,
      graduationYear,
      role: role || 'student'
    });
    console.log('User created successfully:', user._id);

    // Send welcome email (non-blocking)
    setTimeout(() => {
      sendWelcomeEmail(user.email, user.name).catch(err => 
        console.log('Email sending failed:', err.message)
      );
    }, 100);

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.college,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// @route   POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for:', email);

  if (!email || !password) {
    throw new AppError('Email and password are required', ErrorTypes.VALIDATION_ERROR, 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found:', email);
    throw new AppError('Invalid email or password', ErrorTypes.AUTHENTICATION_ERROR, 401);
  }
  
  console.log('User found, checking password...');
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    console.log('Password mismatch for:', email);
    throw new AppError('Invalid email or password', ErrorTypes.AUTHENTICATION_ERROR, 401);
  }
  
  console.log('Login successful for:', email);

  res.json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    college: user.college,
    department: user.department,
    token: generateToken(user._id),
  });
});

// @route   GET /api/users/profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    throw new AppError('User not found', ErrorTypes.NOT_FOUND_ERROR, 404);
  }
  res.json({ success: true, user });
});

// @route   PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, college, department, graduationYear, profile } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.college = college || user.college;
    user.department = department || user.department;
    user.graduationYear = graduationYear || user.graduationYear;
    user.profile = { ...user.profile, ...profile };

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      college: updatedUser.college,
      department: updatedUser.department,
      graduationYear: updatedUser.graduationYear,
      profile: updatedUser.profile
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed", error: error.message });
  }
};

// @route   GET /api/users/all (Admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users, total: users.length });
});

// @route   POST /api/users/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({
        success: true,
        message: 'If this email exists, you will receive a password reset OTP'
      });
    }

    // Check for recent OTP requests (rate limiting)
    const recentOTP = await PasswordReset.findOne({
      email,
      createdAt: { $gt: new Date(Date.now() - 2 * 60 * 1000) } // 2 minutes
    });

    if (recentOTP) {
      return res.status(429).json({ 
        error: 'Please wait 2 minutes before requesting another OTP' 
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    await PasswordReset.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email
    sendPasswordResetOTP(email, user.name, otp);

    res.json({
      success: true,
      message: 'Password reset OTP sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
};

// @route   POST /api/users/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Find valid OTP
    const resetRecord = await PasswordReset.findOne({
      email,
      otp,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    // Mark OTP as used
    resetRecord.used = true;
    await resetRecord.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
