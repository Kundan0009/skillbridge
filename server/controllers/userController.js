// controllers/userController.js

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppError, ErrorTypes, asyncHandler } from '../middleware/errorHandler.js';

// Generate JWT token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// @route   POST /api/users/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, college, department, graduationYear, role } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required', ErrorTypes.VALIDATION_ERROR, 400);
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', ErrorTypes.VALIDATION_ERROR, 400);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User with this email already exists', ErrorTypes.VALIDATION_ERROR, 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    college,
    department,
    graduationYear,
    role: role || 'student'
  });

  res.status(201).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    college: user.college,
    token: generateToken(user._id),
  });
});

// @route   POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', ErrorTypes.VALIDATION_ERROR, 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid email or password', ErrorTypes.AUTHENTICATION_ERROR, 401);
  }
  
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', ErrorTypes.AUTHENTICATION_ERROR, 401);
  }

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
