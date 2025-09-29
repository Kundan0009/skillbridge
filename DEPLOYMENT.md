# Vercel Deployment Guide for SkillBridge

## 🚀 Deploy to Vercel

### 1. Prepare Repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables:

### 3. Environment Variables (Add in Vercel Dashboard)
```
GEMINI_API_KEY=AIzaSyAwRubBnj2hvUgPhvqLACIuIMRe1yL_NAs
MONGO_URI=mongodb+srv://kundan95705:P0Jmrz83n4fFoLGp@cluster2.8sdrr45.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2
JWT_SECRET=sk8f9j2k3l4m5n6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3
NODE_ENV=production
EMAIL_USER=kundan95705@gmail.com
EMAIL_PASS=dagn khnr wbhc bgrv
```

### 4. Update Client Environment
After deployment, update `client/.env.production`:
```
REACT_APP_API_URL=https://your-actual-vercel-url.vercel.app
```

### 5. Create Admin User
After deployment, create admin via Vercel Functions or MongoDB directly:
- Email: admin@skillbridge.com
- Password: Admin@123

## 📱 Features Available
- ✅ AI Resume Analysis
- ✅ User Authentication  
- ✅ Admin Dashboard
- ✅ Mobile Responsive
- ✅ Password Reset via Email
- ✅ Session Management
- ✅ Audit Logging

## 🔧 Post-Deployment
1. Test all features
2. Create admin user
3. Verify email functionality
4. Check mobile responsiveness