import rateLimit from 'express-rate-limit';

// Per-user rate limiting with role-based limits
export const userRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    if (!req.user) return 5; // Anonymous users: 5 requests
    
    switch (req.user.role) {
      case 'admin': return 1000;
      case 'counselor': return 200;
      case 'premium': return 100;
      case 'student': return 20;
      default: return 10;
    }
  },
  keyGenerator: (req) => req.user?.id || req.ip,
  message: (req) => ({
    success: false,
    error: {
      type: 'RATE_LIMIT_ERROR',
      message: `Rate limit exceeded. ${req.user ? 'User' : 'IP'} limit reached.`,
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    }
  }),
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiting for file uploads
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => {
    if (!req.user) return 2; // Anonymous: 2 uploads/hour
    
    switch (req.user.role) {
      case 'admin': return 500;
      case 'counselor': return 100;
      case 'premium': return 50;
      case 'student': return 10;
      default: return 5;
    }
  },
  keyGenerator: (req) => req.user?.id || req.ip,
  message: {
    success: false,
    error: {
      type: 'RATE_LIMIT_ERROR',
      message: 'Upload limit exceeded. Please try again later.'
    }
  }
});

// Authentication rate limiting (prevent brute force)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  keyGenerator: (req) => req.ip,
  message: {
    success: false,
    error: {
      type: 'RATE_LIMIT_ERROR',
      message: 'Too many login attempts. Please try again in 15 minutes.'
    }
  },
  skipSuccessfulRequests: true
});