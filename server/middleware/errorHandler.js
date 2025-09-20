// Error types and codes
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR'
};

// Custom error class
export class AppError extends Error {
  constructor(message, type, statusCode = 500, isOperational = true) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(`Error ${err.type || 'UNKNOWN'}: ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, ErrorTypes.VALIDATION_ERROR, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new AppError(message, ErrorTypes.VALIDATION_ERROR, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', ErrorTypes.AUTHENTICATION_ERROR, 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', ErrorTypes.AUTHENTICATION_ERROR, 401);
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('File too large', ErrorTypes.FILE_UPLOAD_ERROR, 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new AppError('Unexpected file field', ErrorTypes.FILE_UPLOAD_ERROR, 400);
  }

  // Rate limit errors
  if (err.status === 429) {
    error = new AppError('Too many requests', ErrorTypes.RATE_LIMIT_ERROR, 429);
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      type: error.type || ErrorTypes.SERVER_ERROR,
      message: error.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        details: error 
      })
    }
  });
};

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};