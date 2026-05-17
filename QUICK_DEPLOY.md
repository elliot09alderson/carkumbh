# Quick Deploy Reference 🚀

Fast reference for deploying to Vercel.

---

## ⚡ **One-Command Deploy**

### **Backend**
```bash
cd backend
vercel --prod
```

### **Frontend**
```bash
cd frontend
vercel --prod
```

---

## 📋 **Essential Steps**

### **1. Backend Deployment**
```bash
# Navigate and deploy
cd backend
vercel --prod

# After deployment, add environment variables in Vercel Dashboard:
# - MONGODB_URI
# - JWT_SECRET
# - CLOUDINARY_CLOUD_NAME
# - CLOUDINARY_API_KEY
# - CLOUDINARY_API_SECRET
# - FRONTEND_URL (update after frontend deploy)
# - ADMIN_EMAIL
# - ADMIN_PASSWORD

# Note the URL: https://your-backend.vercel.app
```

### **2. Frontend Deployment**
```bash
# Update .env with backend URL
echo "VITE_API_URL=https://your-backend.vercel.app/api" > .env

# Navigate and deploy
cd frontend
vercel --prod

# Or set environment variable in Vercel Dashboard:
# VITE_API_URL = https://your-backend.vercel.app/api

# Note the URL: https://your-frontend.vercel.app
```

### **3. Update Backend CORS**
```bash
# In Vercel Dashboard → Backend Project → Settings → Environment Variables
# Update: FRONTEND_URL = https://your-frontend.vercel.app
# Redeploy or wait for auto-redeploy
```

---

## ✅ **Verification**

```bash
# Test backend
curl https://your-backend.vercel.app/api/health

# Expected: {"status":"OK","message":"Server is running"}

# Test frontend
# Visit: https://your-frontend.vercel.app
# Try: Create booking, admin login, toggle payment
```

---

## 🔑 **Environment Variables**

### **Backend (Vercel Dashboard)**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
ADMIN_EMAIL=admin@carkumbh.com
ADMIN_PASSWORD=Deadpool@123
CLOUDINARY_CLOUD_NAME=dwrltrqcl
CLOUDINARY_API_KEY=546491675525673
CLOUDINARY_API_SECRET=d74gs--kIT3X0h3vLx6zBOfjYD4
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5001
```

### **Frontend (Vercel Dashboard or .env)**
```
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🎯 **What vercel.json Does**

### **Frontend (`frontend/vercel.json`)**
- ✅ Rewrites all routes to `/index.html` (SPA support)
- ✅ Direct URL access works: `/admin`, `/admin-login`
- ✅ Page refresh works on any route
- ✅ Security headers added
- ✅ Static assets cached

### **Backend (`backend/vercel.json`)**
- ✅ Deploys Express as serverless function
- ✅ Routes all API requests to `server.js`
- ✅ Auto-scaling enabled

---

## 🐛 **Common Issues**

| Issue | Fix |
|-------|-----|
| 404 on refresh | ✅ Already fixed by `vercel.json` |
| CORS errors | Update `FRONTEND_URL` in backend env vars |
| Env vars not working | Set in Vercel Dashboard, redeploy |
| Video not loading | Check file size, consider CDN |

---

## 📱 **URLs to Share**

```
Production Frontend: https://_____.vercel.app
Production Backend:  https://_____.vercel.app/api

Admin Login:         https://_____.vercel.app/admin-login
Public Booking:      https://_____.vercel.app
```

---

## 🔄 **Auto-Deploy**

Connect to Git in Vercel Dashboard:
```
git push origin main → Auto deploys to production
git push origin dev  → Auto deploys to preview
```

---

## 📊 **Files Created**

- ✅ `frontend/vercel.json` - SPA routing config
- ✅ `backend/vercel.json` - Serverless API config
- ✅ `DEPLOYMENT_GUIDE.md` - Full deployment guide
- ✅ `QUICK_DEPLOY.md` - This quick reference

---

## 🎉 **Deploy Now!**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy both
cd backend && vercel --prod
cd ../frontend && vercel --prod
```

**Done!** 🚀
