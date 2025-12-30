// index.js

import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import jdMatcherRoutes from './routes/jdMatcherRoutes.js';
import interviewBotRoutes from './routes/interviewBotRoutes.js';
import learningPathRoutes from './routes/learningPathRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import experimentRoutes from './routes/experimentRoutes.js';
import { sanitizeInputs } from './middleware/security.js';
import { cleanupOldFiles } from './middleware/fileValidation.js';
import { errorHandler } from './middleware/errorHandler.js';
import { userRateLimit } from './middleware/rateLimiting.js';
import { logger, requestLogger } from './middleware/logger.js';

// Initialize
dotenv.config();

// Validate environment variables
const required = ['GEMINI_API_KEY', 'MONGO_URI', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}
logger.info('Environment variables validated');

connectDB();
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting disabled for development
if (process.env.NODE_ENV === 'production') {
  app.use(userRateLimit);
}

// CORS configuration
const allowedOrigins = [
  'http://localhost:4000',
  'http://localhost:3000',
  'https://lj7rtwcw-4000.inc1.devtunnels.ms',
  'https://skillbridge-j5l4-git-main-kundan-kumars-projects-3dfd602d.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Security middleware
app.use(sanitizeInputs);

// CSRF protection disabled for development
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.method === 'GET' || req.path === '/api/health') {
      return next();
    }
    const referer = req.get('Referer') || req.get('Origin');
    if (referer && allowedOrigins.some(origin => referer.startsWith(origin))) {
      return next();
    }
    return res.status(403).json({ error: 'CSRF protection: Invalid origin' });
  });
}

// Debug middleware
app.use('/api/users', (req, res, next) => {
  console.log(`USER ROUTE: ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jd-matcher', jdMatcherRoutes);
app.use('/api/interview-bot', interviewBotRoutes);
app.use('/api/learning-path', learningPathRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/experiments', experimentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'SkillBridge API Server', status: 'Running' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test route
app.post('/api/test', (req, res) => {
  res.json({ success: true, message: 'Server working', body: req.body });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// File cleanup scheduler (every 6 hours)
setInterval(cleanupOldFiles, 6 * 60 * 60 * 1000);

// Server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 SKILLBRIDGE SERVER STARTED!');
  console.log('='.repeat(50));
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📊 ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🍃 MongoDB: ${process.env.MONGO_URI ? '✅ Connected' : '❌ Not configured'}`);
  console.log(`🤖 Gemini: ${process.env.GEMINI_API_KEY ? '✅ Ready' : '❌ Missing'}`);
  console.log('='.repeat(50));
  console.log('✅ READY TO ACCEPT REQUESTS!');
  console.log('='.repeat(50) + '\n');
  
  logger.info(`Server started on port ${PORT}`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});
