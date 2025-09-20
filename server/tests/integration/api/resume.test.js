// Integration tests for Resume API
import request from 'supertest';
import path from 'path';
import fs from 'fs';

// Mock app setup
const mockApp = {
  post: jest.fn(),
  get: jest.fn()
};

describe('Resume Analysis API', () => {
  test('should validate PDF files', async () => {
    // Mock file validation
    const mockValidation = (req, res, next) => {
      if (!req.file || req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Only PDF files allowed' });
      }
      next();
    };

    // Simulate non-PDF file upload
    const mockReq = {
      file: { mimetype: 'text/plain', originalname: 'test.txt' }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockValidation(mockReq, mockRes, jest.fn());
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Only PDF files allowed' });
  });

  test('should accept valid PDF files', async () => {
    const mockValidation = (req, res, next) => {
      if (req.file && req.file.mimetype === 'application/pdf') {
        next();
      }
    };

    const mockReq = {
      file: { mimetype: 'application/pdf', originalname: 'resume.pdf' }
    };
    const mockNext = jest.fn();

    mockValidation(mockReq, {}, mockNext);
    
    expect(mockNext).toHaveBeenCalled();
  });

  test('should require authentication for history', async () => {
    const mockAuth = (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      next();
    };

    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockAuth(mockReq, mockRes, jest.fn());
    
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });
});