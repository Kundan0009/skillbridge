import { body, validationResult } from 'express-validator';
import { AppError, ErrorTypes } from './errorHandler.js';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    throw new AppError(errorMessages, ErrorTypes.VALIDATION_ERROR, 400);
  }
  next();
};

// User registration validation
export const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be 6-128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  
  body('college')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('College name too long'),
  
  body('role')
    .optional()
    .isIn(['student', 'counselor', 'admin'])
    .withMessage('Invalid role'),
  
  handleValidationErrors
];

// User login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// File upload validation
export const validateFileUpload = [
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('PDF file is required');
    }
    
    if (req.file.mimetype !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }
    
    if (req.file.size > 5 * 1024 * 1024) {
      throw new Error('File too large (max 5MB)');
    }
    
    return true;
  }),
  
  handleValidationErrors
];

// Profile update validation
export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2-50 characters'),
  
  body('college')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('College name too long'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Department name too long'),
  
  body('graduationYear')
    .optional()
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Invalid graduation year'),
  
  handleValidationErrors
];