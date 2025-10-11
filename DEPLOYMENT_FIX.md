# Deployment Fix Guide

## Issues Fixed:

### 1. API URL Configuration
- Updated `.env.production` with correct Vercel URL
- Increased API timeout to 30 seconds for Vercel functions
- Disabled credentials for better compatibility

### 2. Vercel Configuration
- Added proper environment variable references
- Set function timeout to 30 seconds
- Updated routing configuration

### 3. CORS Configuration
- Added explicit Vercel URL to allowed origins
- Improved origin checking logic
- Disabled credentials for production

## Deployment Steps:

### 1. Set Environment Variables in Vercel Dashboard:
```
GEMINI_API_KEY=AIzaSyAwRubBnj2hvUgPhvqLACIuIMRe1yL_NAs
MONGO_URI=mongodb+srv://kundan95705:P0Jmrz83n4fFoLGp@cluster2.8sdrr45.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2
JWT_SECRET=sk8f9j2k3l4m5n6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3
CLIENT_URL=https://skillbridge-kappa.vercel.app
EMAIL_USER=kundan95705@gmail.com
EMAIL_PASS=dagn khnr wbhc bgrv
```

### 2. Update Vercel Project Settings:
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add all the above variables
- Redeploy the project

### 3. Test the Deployment:
- Visit your Vercel URL
- Try login/signup functionality
- Check browser console for any errors

## Common Issues & Solutions:

### Issue: "Cannot connect to server"
**Solution:** Check if environment variables are properly set in Vercel dashboard

### Issue: CORS errors
**Solution:** Ensure CLIENT_URL matches your actual Vercel deployment URL

### Issue: Function timeout
**Solution:** API calls now have 30-second timeout, should handle most cases

### Issue: 404 on API routes
**Solution:** Ensure vercel.json routing is correct (already fixed)

## Local Testing:
```bash
# Test with production build locally
cd client
npm run build
npm install -g serve
serve -s build -l 4000

# In another terminal
cd server
NODE_ENV=production npm start
```