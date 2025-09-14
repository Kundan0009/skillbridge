# SkillBridge Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. Push code to GitHub
2. Connect Vercel to your repository
3. Set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
4. Deploy automatically

#### Backend (Railway)
1. Connect Railway to your GitHub repository
2. Set environment variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_production_jwt_secret
   CLIENT_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   PORT=5000
   ```
3. Deploy automatically

### Option 2: Netlify + Render

#### Frontend (Netlify)
1. Drag and drop `client/build` folder
2. Or connect to GitHub for auto-deployment

#### Backend (Render)
1. Connect to GitHub
2. Set environment variables
3. Deploy as web service

### Option 3: AWS (Advanced)

#### Frontend (S3 + CloudFront)
```bash
# Build the app
cd client
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name
```

#### Backend (EC2 or Elastic Beanstalk)
```bash
# Create deployment package
zip -r skillbridge-backend.zip server/
```

## 🔧 Pre-Deployment Checklist

### Environment Variables
- [ ] GEMINI_API_KEY configured
- [ ] MONGO_URI pointing to production database
- [ ] JWT_SECRET is strong and unique
- [ ] CLIENT_URL matches frontend domain
- [ ] NODE_ENV=production

### Security
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] File upload restrictions in place

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured
- [ ] Connection string tested

### Testing
- [ ] All features tested locally
- [ ] API endpoints tested
- [ ] File upload tested
- [ ] Authentication flow tested

## 🌐 Domain Configuration

### Custom Domain Setup
1. Purchase domain from registrar
2. Configure DNS records:
   ```
   A record: @ -> your-server-ip
   CNAME: www -> your-domain.com
   ```

### SSL Certificate
- Vercel/Netlify: Automatic HTTPS
- Custom server: Use Let's Encrypt

## 📊 Monitoring & Analytics

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics
- **Performance**: Lighthouse CI

### Health Check Endpoint
```javascript
// Already implemented at /api/health
GET /api/health
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: |
          cd client && npm install
          cd ../server && npm install
      - name: Build frontend
        run: cd client && npm run build
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## 🐳 Docker Deployment

### Dockerfile (Backend)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
  
  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 🚨 Troubleshooting

### Common Issues

#### CORS Errors
- Check CLIENT_URL in backend .env
- Verify frontend API_URL

#### Database Connection
- Verify MongoDB Atlas IP whitelist
- Check connection string format

#### File Upload Issues
- Verify file size limits
- Check MIME type restrictions

#### API Key Issues
- Verify Gemini API key is valid
- Check API quotas and billing

### Logs and Debugging
```bash
# View application logs
heroku logs --tail

# Railway logs
railway logs

# Local debugging
DEBUG=* npm start
```

## 📈 Performance Optimization

### Frontend
- Enable gzip compression
- Optimize images
- Code splitting
- CDN for static assets

### Backend
- Database indexing
- Response caching
- Connection pooling
- Load balancing

## 🔐 Security Best Practices

### Production Security
- Use HTTPS everywhere
- Implement CSP headers
- Regular dependency updates
- Environment variable security
- Database access restrictions

### Monitoring
- Set up error alerts
- Monitor API usage
- Track performance metrics
- Security vulnerability scanning