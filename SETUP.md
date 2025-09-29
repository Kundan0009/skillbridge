# SkillBridge - Quick Setup Guide

## 🚀 Quick Start (Windows)

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### 1. Environment Setup

**Server Environment (.env in server folder):**
```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
PORT=9000
NODE_ENV=development
CLIENT_URL=http://localhost:4000
```

**Client Environment (.env in client folder):**
```env
REACT_APP_API_URL=http://localhost:9000
```

### 2. Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Start Application

**Option A: Use the batch file (Windows)**
```bash
# From project root
start.bat
```

**Option B: Manual start**
```bash
# Terminal 1 - Start server
cd server
npm start

# Terminal 2 - Start client
cd client
npm start
```

### 4. Access Application
- Frontend: http://localhost:4000
- Backend API: http://localhost:9000

## 🔧 Fixed Issues

### Security Fixes
✅ **Path Traversal Vulnerabilities** - Added safe path resolution
✅ **Hardcoded Credentials** - Moved to environment variables
✅ **CSRF Protection** - Added origin validation
✅ **Package Vulnerabilities** - Updated vulnerable packages

### Performance Fixes
✅ **Startup Script** - Added health checks and error handling
✅ **File Cleanup** - Improved old file cleanup process

### Configuration Fixes
✅ **Cross-env Dependency** - Fixed Windows compatibility
✅ **Port Configuration** - Standardized port usage
✅ **CORS Setup** - Improved origin validation

## 🛡️ Security Features

- JWT Authentication
- Rate Limiting
- Input Sanitization
- File Upload Validation
- Path Traversal Protection
- CORS Protection
- Helmet Security Headers

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Resume Analysis
- `POST /api/resumes/analyze` - Analyze resume
- `GET /api/resumes/history` - Get resume history
- `GET /api/resumes/:id` - Get specific analysis

### Health Check
- `GET /api/health` - Server health status

## 🐛 Troubleshooting

### Common Issues

**1. Server won't start**
- Check MongoDB connection string
- Verify Gemini API key
- Ensure port 9000 is available

**2. Client won't start**
- Check if port 4000 is available
- Verify React dependencies are installed
- Clear npm cache: `npm cache clean --force`

**3. CORS Errors**
- Verify CLIENT_URL in server .env
- Check if both servers are running
- Ensure correct ports are configured

**4. File Upload Issues**
- Check uploads folder exists in server directory
- Verify file permissions
- Ensure PDF files are valid

### Environment Variables

Make sure all required environment variables are set:

**Server (.env):**
- `GEMINI_API_KEY` - Your Google Gemini API key
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PORT` - Server port (default: 9000)
- `CLIENT_URL` - Client URL for CORS

**Client (.env):**
- `REACT_APP_API_URL` - Backend API URL

## 📝 Development Notes

- Server runs on port 9000
- Client runs on port 4000
- MongoDB connection required
- Gemini AI integration for resume analysis
- File uploads stored temporarily and cleaned up automatically

## 🔄 Next Steps

1. Set up your environment variables
2. Run the application using `start.bat`
3. Register a new account
4. Upload a PDF resume for analysis
5. Explore the dashboard features

For detailed documentation, see the main README.md file.