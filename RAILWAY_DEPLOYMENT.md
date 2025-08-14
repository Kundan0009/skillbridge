# Railway Deployment Guide

## 🚀 Deploy to Railway

### 1. Prerequisites
- GitHub repository with your code
- Railway account (https://railway.app)
- MongoDB Atlas account (for database)

### 2. Environment Variables
Set these in Railway dashboard:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbridge
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### 3. Deploy Steps

1. **Connect Repository**:
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your skillbridge repository

2. **Configure Build**:
   - Railway will auto-detect the Dockerfile
   - Build will start automatically

3. **Set Environment Variables**:
   - Go to project settings
   - Add all required environment variables
   - Save changes

4. **Deploy**:
   - Railway will automatically deploy
   - Get your deployment URL

### 4. MongoDB Atlas Setup

1. Create MongoDB Atlas account
2. Create new cluster
3. Add database user
4. Whitelist Railway IPs (0.0.0.0/0 for simplicity)
5. Get connection string
6. Add to MONGO_URI environment variable

### 5. Frontend Configuration

Update your frontend to use the Railway backend URL:

```javascript
// In client/src/App.js
axios.defaults.baseURL = 'https://your-railway-app.railway.app';
```

### 6. Custom Domain (Optional)

1. Go to Railway project settings
2. Add custom domain
3. Update DNS records
4. Update CLIENT_URL environment variable

## 🔧 Troubleshooting

- **Build fails**: Check Dockerfile and dependencies
- **Database connection**: Verify MongoDB Atlas connection string
- **CORS errors**: Ensure CLIENT_URL is set correctly
- **File uploads**: Railway has ephemeral storage, consider cloud storage for production

## 📊 Monitoring

Railway provides:
- Real-time logs
- Metrics dashboard
- Deployment history
- Environment variable management