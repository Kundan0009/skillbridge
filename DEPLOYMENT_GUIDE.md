# SkillBridge Deployment Guide

## 🎯 Quick Start for College Deployment

### Prerequisites
1. **Server Requirements**:
   - Node.js 16+ installed
   - MongoDB 4.4+ (local or cloud)
   - OpenAI API account
   - 2GB+ RAM, 10GB+ storage

2. **Get OpenAI API Key**:
   - Visit https://platform.openai.com/
   - Create account and get API key
   - Add billing information (required for API usage)

### Step-by-Step Setup

#### 1. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend  
cd ../client
npm install
```

#### 2. Configure Environment
```bash
# Copy example environment file
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your_college_secret_key_2024
OPENAI_API_KEY=sk-your-openai-key-here
PORT=5000
CLIENT_URL=http://localhost:3000
```

#### 3. Start MongoDB
```bash
# If using local MongoDB
mongod --dbpath /path/to/your/db

# Or use MongoDB Atlas (cloud)
# Just update MONGO_URI in .env
```

#### 4. Run the Application
```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
cd client  
npm start
```

#### 5. Create Admin Account
1. Go to http://localhost:3000
2. Register with role "admin"
3. Use college email for verification

## 🏫 College-Specific Configuration

### User Roles Setup
- **Students**: Default registration role
- **Career Counselors**: Can view student analytics
- **Admins**: Full system access

### Customization Options
1. **College Branding**: Update logo and colors in `client/src/App.css`
2. **Email Domain**: Restrict registration to college emails
3. **Analysis Prompts**: Customize AI prompts for specific industries

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Set up HTTPS in production
- [ ] Configure CORS for your domain
- [ ] Set up rate limiting
- [ ] Regular security updates
- [ ] Backup database regularly

## 📊 Usage Analytics

### Track Key Metrics
- Total students registered
- Resumes analyzed per month
- Average improvement scores
- Most common resume issues

### Admin Dashboard Features
- User management
- Bulk resume processing
- System health monitoring
- Usage statistics

## 🚀 Production Deployment

### Option 1: Traditional Server
```bash
# Install PM2 for process management
npm install -g pm2

# Start backend with PM2
cd server
pm2 start index.js --name "skillbridge-api"

# Build and serve frontend
cd ../client
npm run build
# Serve build folder with nginx/apache
```

### Option 2: Cloud Deployment (Heroku)
```bash
# Install Heroku CLI
# Create Heroku apps
heroku create skillbridge-api
heroku create skillbridge-client

# Set environment variables
heroku config:set OPENAI_API_KEY=your-key --app skillbridge-api
heroku config:set JWT_SECRET=your-secret --app skillbridge-api
heroku config:set MONGO_URI=your-mongodb-uri --app skillbridge-api

# Deploy
git push heroku main
```

### Option 3: Docker Deployment
```dockerfile
# Create docker-compose.yml
version: '3.8'
services:
  mongodb:
    image: mongo:4.4
    volumes:
      - mongodb_data:/data/db
    
  backend:
    build: ./server
    environment:
      - MONGO_URI=mongodb://mongodb:27017/skillbridge
      - JWT_SECRET=your_secret
      - OPENAI_API_KEY=your_key
    depends_on:
      - mongodb
      
  frontend:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## 🎓 College Integration Tips

### 1. Student Onboarding
- Send registration links via college email
- Integrate with existing student portals
- Provide tutorial videos

### 2. Career Center Integration
- Train counselors on the system
- Set up regular analysis sessions
- Create reporting workflows

### 3. Faculty Access
- Provide read-only access for professors
- Generate class-wide analytics
- Track student progress over semesters

## 📈 Scaling for Large Colleges

### Performance Optimization
- Implement Redis caching
- Use CDN for static assets
- Database indexing optimization
- Load balancing for high traffic

### Cost Management
- Monitor OpenAI API usage
- Implement usage quotas per user
- Optimize AI prompts for efficiency
- Consider bulk processing schedules

## 🔧 Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor API usage and costs
- Backup database weekly
- Review security logs
- Update AI prompts based on feedback

### Troubleshooting Common Issues
1. **OpenAI API Errors**: Check API key and billing
2. **MongoDB Connection**: Verify connection string
3. **File Upload Issues**: Check file size limits
4. **Slow Analysis**: Monitor API response times

## 📞 Support & Training

### For IT Administrators
- System architecture overview
- Security best practices
- Monitoring and maintenance

### For Career Center Staff
- User management training
- Analytics interpretation
- Student guidance workflows

### For Students
- How to upload resumes
- Understanding analysis results
- Improving resume scores

---

**Need Help?** Contact your system administrator or create an issue on the project repository.