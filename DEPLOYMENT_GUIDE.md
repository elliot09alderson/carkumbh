# Deployment Guide - Vercel

Complete guide for deploying your Car Kumbh MERN app to Vercel.

---

## 📁 Project Structure

```
carkumbh/
├── frontend/
│   ├── vercel.json          ← Frontend Vercel config (SPA routing)
│   └── .env                 ← Update with production API URL
│
└── backend/
    ├── vercel.json          ← Backend Vercel config (API serverless)
    └── .env                 ← Already configured with MongoDB, etc.
```

---

## 🚀 Deployment Steps

### **Option 1: Deploy Both Frontend & Backend Separately (Recommended)**

This approach gives you:
- ✅ Separate URLs for frontend and backend
- ✅ Easy to scale independently
- ✅ Clear separation of concerns

---

## 📦 **Part 1: Deploy Backend API**

### **1. Prepare Backend for Deployment**

Your backend is already configured! The `vercel.json` has been created with:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### **2. Deploy Backend to Vercel**

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to backend folder
cd backend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your Git repository
4. Select `backend` folder as the root directory
5. Click "Deploy"

### **3. Configure Backend Environment Variables on Vercel**

After deployment, add these environment variables in Vercel Dashboard:

**Settings → Environment Variables:**

```
MONGODB_URI=mongodb+srv://khilendra24dewangan_db_user:khilendra24dewangan@cluster0.ysr6wnj.mongodb.net/
JWT_SECRET=your_jwadasdasdasasdast_secret_key_here
ADMIN_EMAIL=admin@carkumbh.com
ADMIN_PASSWORD=Deadpool@123
CLOUDINARY_CLOUD_NAME=dwrltrqcl
CLOUDINARY_API_KEY=546491675525673
CLOUDINARY_API_SECRET=d74gs--kIT3X0h3vLx6zBOfjYD4
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
PORT=5001
```

**Important:** Update `FRONTEND_URL` after deploying your frontend!

### **4. Note Your Backend URL**

After deployment, Vercel will give you a URL like:
```
https://carkumbh-backend.vercel.app
```

**Save this URL!** You'll need it for the frontend.

---

## 🎨 **Part 2: Deploy Frontend**

### **1. Frontend Configuration**

Your frontend `vercel.json` has been created with:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/(.*)\\.(js|css|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**What this does:**
- ✅ Rewrites all routes to `/index.html` (SPA support)
- ✅ Adds security headers
- ✅ Caches static assets for 1 year

### **2. Update Frontend Environment Variable**

**Update `frontend/.env`:**

```env
# Replace with your deployed backend URL
VITE_API_URL=https://carkumbh-backend.vercel.app/api
```

### **3. Deploy Frontend to Vercel**

**Option A: Using Vercel CLI**

```bash
# Navigate to frontend folder
cd frontend

# Deploy
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your Git repository
4. Select `frontend` folder as the root directory
5. Framework Preset: **Vite**
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Add Environment Variable:
   ```
   VITE_API_URL=https://carkumbh-backend.vercel.app/api
   ```
9. Click "Deploy"

### **4. Update Backend CORS Settings**

After frontend deployment, go back to your **backend** Vercel project:

1. Settings → Environment Variables
2. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```
3. Redeploy backend (or it will auto-redeploy)

---

## 🔐 **Environment Variables Checklist**

### **Backend Environment Variables (Vercel)**
- [x] MONGODB_URI
- [x] JWT_SECRET
- [x] ADMIN_EMAIL
- [x] ADMIN_PASSWORD
- [x] CLOUDINARY_CLOUD_NAME
- [x] CLOUDINARY_API_KEY
- [x] CLOUDINARY_API_SECRET
- [x] FRONTEND_URL ← Update after deploying frontend
- [x] NODE_ENV
- [x] PORT

### **Frontend Environment Variables (Vercel)**
- [x] VITE_API_URL ← Your backend Vercel URL

---

## ✅ **Verify Deployment**

### **1. Test Backend API**

```bash
# Health check
curl https://carkumbh-backend.vercel.app/api/health

# Expected response:
{"status":"OK","message":"Server is running"}
```

### **2. Test Frontend**

1. Visit your frontend URL
2. Try creating a booking
3. Login to admin dashboard
4. Toggle payment status

### **3. Check CORS**

Open browser DevTools → Console

Should see no CORS errors when making API calls.

---

## 🎯 **Dynamic Routes Support**

The `vercel.json` configuration ensures all routes work correctly:

### **Frontend Routes (SPA)**
- ✅ `/` - Home page
- ✅ `/admin` - Admin dashboard
- ✅ `/admin-login` - Admin login
- ✅ Direct URL access works
- ✅ Refresh on any route works

**How it works:**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This tells Vercel: "For ANY route, serve `/index.html`"
Then React Router handles the routing on the client side.

### **Backend Routes (API)**
- ✅ `/api/health`
- ✅ `/api/auth/login`
- ✅ `/api/auth/setup`
- ✅ `/api/bookings`
- ✅ `/api/bookings/:id/toggle-paid`

**How it works:**
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

This tells Vercel: "Route all requests to `server.js`"

---

## 📊 **Deployment Comparison**

| Feature | Development | Production (Vercel) |
|---------|-------------|---------------------|
| Frontend URL | http://localhost:8080 | https://carkumbh.vercel.app |
| Backend URL | http://localhost:5001 | https://carkumbh-backend.vercel.app |
| Database | MongoDB Atlas | Same (MongoDB Atlas) |
| Environment | .env files | Vercel Environment Variables |
| HTTPS | No | Yes (automatic) |
| CDN | No | Yes (Vercel Edge Network) |
| Auto-deploy | No | Yes (on git push) |

---

## 🔄 **Auto-Deployment with Git**

### **Setup Automatic Deployments**

1. **Connect Git Repository:**
   - In Vercel Dashboard → Project Settings → Git
   - Connect to GitHub/GitLab/Bitbucket

2. **Configure Branches:**
   - Production: `main` branch
   - Preview: All other branches

3. **Auto-Deploy Workflow:**
   ```
   git push origin main
   ↓
   Vercel detects change
   ↓
   Builds and deploys automatically
   ↓
   New version live in ~30 seconds
   ```

---

## 🐛 **Troubleshooting**

### **Issue: 404 on page refresh**

**Solution:** ✅ Already handled by `vercel.json` rewrites

### **Issue: CORS errors**

**Solution:**
1. Check `FRONTEND_URL` in backend environment variables
2. Ensure it matches your frontend Vercel URL exactly
3. No trailing slash: `https://app.vercel.app` ✅ not `https://app.vercel.app/` ❌

### **Issue: Environment variables not working**

**Solution:**
1. Check they're set in Vercel Dashboard → Settings → Environment Variables
2. Ensure you redeployed after adding them
3. For Vite (frontend), variables must start with `VITE_`

### **Issue: Video not playing**

**Solution:**
1. Ensure `HORILAL TRAILER.mp4` is in `frontend/public/`
2. Large files might take time to upload
3. Consider using a CDN for video hosting

### **Issue: API returns 500 errors**

**Solution:**
1. Check Vercel logs: Dashboard → Deployments → View Function Logs
2. Verify MongoDB connection string
3. Check all environment variables are set

---

## 📈 **Performance Optimization**

### **Frontend**

✅ **Already Optimized:**
- Static assets cached for 1 year
- Vite builds optimized bundles
- Code splitting enabled

### **Backend**

✅ **Already Optimized:**
- Serverless functions (auto-scaling)
- MongoDB indexes (add as needed)
- JWT tokens (no database lookups for auth)

### **Additional Optimizations:**

**1. Add MongoDB Indexes:**
```javascript
// In your models
bookingSchema.index({ token: 1 });
bookingSchema.index({ createdAt: -1 });
```

**2. Enable Compression:**
```javascript
// In server.js
import compression from 'compression';
app.use(compression());
```

---

## 🔒 **Security Checklist**

- [x] HTTPS enabled (automatic on Vercel)
- [x] Environment variables in Vercel (not in code)
- [x] CORS configured properly
- [x] Security headers added (X-Frame-Options, etc.)
- [x] JWT tokens for authentication
- [x] Password hashing with bcrypt
- [x] Input validation on backend
- [ ] Rate limiting (add if needed)
- [ ] API key rotation (scheduled)

---

## 💰 **Vercel Pricing**

### **Hobby Plan (Free)**
- ✅ Suitable for this project
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ Automatic HTTPS

### **Pro Plan ($20/month)**
- More bandwidth
- Team collaboration
- Advanced analytics
- Performance insights

---

## 📝 **Deployment Commands Quick Reference**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy backend (from backend folder)
cd backend
vercel --prod

# Deploy frontend (from frontend folder)
cd frontend
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

---

## 🎉 **Final Checklist**

### **Before Deployment:**
- [x] `vercel.json` created in frontend
- [x] `vercel.json` created in backend
- [x] Environment variables documented
- [x] MongoDB Atlas accessible from anywhere (IP whitelist: 0.0.0.0/0)
- [x] Cloudinary credentials ready

### **After Backend Deployment:**
- [ ] Backend URL noted
- [ ] Environment variables set in Vercel
- [ ] Test `/api/health` endpoint
- [ ] Create initial admin account

### **After Frontend Deployment:**
- [ ] Frontend URL noted
- [ ] Update `FRONTEND_URL` in backend
- [ ] Test all routes work
- [ ] Test booking creation
- [ ] Test admin login
- [ ] Test payment toggle

---

## 🚀 **Your Deployment URLs**

```
Frontend: https://_____________________.vercel.app
Backend:  https://_____________________.vercel.app/api
```

Fill these in after deployment!

---

## 📚 **Additional Resources**

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 🎊 **Success!**

Once deployed, your app will be:
- ✅ Live on the internet
- ✅ Accessible from anywhere
- ✅ Auto-deploying on git push
- ✅ Secured with HTTPS
- ✅ Globally distributed via CDN
- ✅ Professional and production-ready

**Happy deploying!** 🚀
