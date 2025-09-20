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
import { sanitizeInputs } from './middleware/security.js';
import { cleanupOldFiles } from './middleware/fileValidation.js';
import { errorHandler } from './middleware/errorHandler.js';
import { userRateLimit } from './middleware/rateLimiting.js';

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
console.log('✅ Environment variables validated');

connectDB();
const app = express();

// Security middleware
app.use(helmet());

// Per-user rate limiting
app.use(userRateLimit);

// CORS configuration
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:4000', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
app.use(sanitizeInputs);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jd-matcher', jdMatcherRoutes);
app.use('/api/interview-bot', interviewBotRoutes);
app.use('/api/learning-path', learningPathRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🧹 File cleanup scheduled every 6 hours`);
});
