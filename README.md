🚀 SkillBridge – Advanced Resume Analyzer

CI/CD Pipeline Active

AI-powered resume analysis platform built for college students and career centers.
Built using React, Node.js, MongoDB, and Google Gemini AI.

1️⃣ Project Overview

SkillBridge is an intelligent resume analysis system that:

Uses Google Gemini AI for deep resume evaluation

Provides ATS compatibility scoring

Offers keyword optimization & skills gap analysis

Tracks resume improvement over time

Supports students, counselors, and admins

2️⃣ Core Features
👨‍🎓 Student Features

AI-Powered Resume Analysis

ATS Compatibility Check

Section-wise Feedback

Industry Keyword Optimization

Skills Gap Identification

Resume History Tracking

Analytics Dashboard (Charts + Progress)

PDF Export of Reports

Animated Upload & Real-time Progress

Guided Onboarding Experience

👩‍🏫 Career Counselor Features

Access student analysis reports

Provide structured guidance

Track performance trends

Role-based dashboard

🛠 Admin Features

User Management

Role-based Access Control

Bulk Resume Analysis

Usage & System Analytics

Performance Monitoring

3️⃣ Security Features

JWT Authentication

Rate Limiting

CORS Protection

Helmet Security Headers

Input Validation

XSS Protection

Secure PDF File Processing

4️⃣ Technology Stack
🔹 Backend

Node.js

Express.js

MongoDB + Mongoose

Google Gemini AI

JWT

Multer

PDF-Parse

Express Validator

Helmet

Express Rate Limit

🔹 Frontend

React 19 (Hooks + Modern Patterns)

Tailwind CSS

Axios

jsPDF

Animated UI Components

Progressive Web App (PWA)

Real-time Upload Progress

5️⃣ System Architecture Flow

User registers/login (JWT Authentication)

Resume PDF uploaded

PDF parsed using pdf-parse

Resume content sent to Gemini AI

AI returns structured analysis

Analysis stored in MongoDB

Dashboard displays analytics + charts

User can export PDF report

6️⃣ Installation & Setup
Step 1: Clone Repository
git clone https://github.com/yourusername/skillbridge.git
cd skillbridge
Step 2: Backend Setup
cd server
npm install
cp .env.example .env

Update .env:

GEMINI_API_KEY=your_key
MONGO_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your_secret
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:4000

Start backend:

npm start
Step 3: Frontend Setup
cd ../client
npm install

Create .env:

REACT_APP_API_URL=http://localhost:5000
PORT=4000

Start frontend:

npm start
7️⃣ API Structure
Authentication

POST /api/users/register

POST /api/users/login

GET /api/users/profile

PUT /api/users/profile

Resume

POST /api/resumes/analyze

GET /api/resumes/history

GET /api/resumes/:id

Analytics

GET /api/analytics/user

GET /api/analytics/admin

Admin

GET /api/users/all

POST /api/resumes/bulk-analyze

8️⃣ Deployment
Production Environment Variables
NODE_ENV=production
GEMINI_API_KEY=production_key
MONGO_URI=production_uri
JWT_SECRET=production_secret
CLIENT_URL=https://your-domain.com
PORT=5000
Docker Deployment (Optional)
docker-compose up --build
9️⃣ Resume Analysis Metrics

Overall Resume Score (0–100)

ATS Score

Section Scores

Keyword Match %

Industry Fit Score

Personalized Recommendations

🔟 CI/CD Pipeline

GitHub Actions workflow

Automatic testing on push

Build verification

Deployment pipeline ready

1️⃣1️⃣ User Roles
Role	Permissions
Student	Upload, Analyze, Track
Counselor	View & Guide Students
Admin	Full System Control
1️⃣2️⃣ Contribution Guide

Fork repository

Create feature branch

Commit changes

Push to branch

Open Pull Request

1️⃣3️⃣ License

MIT License

1️⃣4️⃣ Support

Create GitHub Issue

Project Wiki

Email Support
