# Quick Setup Guide

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Backend Environment

Edit `backend/.env` and fill in your credentials:

### MongoDB Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env`

Example:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carkumbh?retryWrites=true&w=majority
```

### Cloudinary Setup
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for a free account
3. Get your credentials from the dashboard
4. Fill in the `.env`:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### JWT Secret
Generate a random string for JWT_SECRET:

```bash
# On Linux/Mac
openssl rand -base64 32

# Or just use any random string
JWT_SECRET=mySecretKey123456789
```

### Admin Credentials
Set your admin login credentials:

```
ADMIN_EMAIL=admin@carkumbh.com
ADMIN_PASSWORD=YourSecurePassword123
```

## Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Step 4: Start the Application

### Terminal 1 - Start Backend
```bash
cd backend
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: cluster.mongodb.net
```

### Terminal 2 - Start Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Step 5: Create Admin Account

Before accessing the admin dashboard, create your admin account:

### Option 1: Using cURL
```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@carkumbh.com",
    "password": "YourSecurePassword123"
  }'
```

### Option 2: Using Postman
1. Open Postman
2. Create a POST request to `http://localhost:5000/api/auth/setup`
3. Set Body to raw JSON:
```json
{
  "email": "admin@carkumbh.com",
  "password": "YourSecurePassword123"
}
```
4. Send the request

### Option 3: Using JavaScript in Browser Console
Open `http://localhost:5173` and paste this in the browser console:

```javascript
fetch('http://localhost:5000/api/auth/setup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@carkumbh.com',
    password: 'YourSecurePassword123'
  })
})
.then(r => r.json())
.then(console.log)
```

## Step 6: Test the Application

### Test User Booking
1. Go to `http://localhost:5173`
2. Fill in the booking form
3. Select a package
4. Choose payment mode (cash or online)
5. If online: upload a test image
6. Submit and get your token

### Test Admin Dashboard
1. Go to `http://localhost:5173/admin-login`
2. Login with your admin credentials
3. View all bookings
4. Toggle payment status
5. View uploaded screenshots (if any)

## Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct
- Ensure port 5000 is not in use
- Verify all environment variables are set

### Frontend won't start
- Run `npm install` in the frontend directory
- Check if port 5173 is available
- Clear browser cache

### Can't upload images
- Verify Cloudinary credentials are correct
- Check image size (max 5MB)
- Ensure file is an image type (jpg, png, etc.)

### Can't login to admin
- Make sure you created the admin account first
- Check email and password match what you set
- Clear browser cache and try again

### API requests failing
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify `VITE_API_URL` in frontend `.env`

## Next Steps

1. **Secure the setup endpoint**: After creating your admin, consider removing or protecting the `/api/auth/setup` route
2. **Update UPI QR Code**: Replace `frontend/src/assets/upi-qr.jpeg` with your actual QR code
3. **Customize**: Update branding, colors, and text as needed
4. **Deploy**: Follow the deployment section in README.md

## Environment Variables Checklist

### Backend (.env)
- [x] MONGODB_URI
- [x] PORT (optional, defaults to 5000)
- [x] JWT_SECRET
- [x] ADMIN_EMAIL
- [x] ADMIN_PASSWORD
- [x] CLOUDINARY_CLOUD_NAME
- [x] CLOUDINARY_API_KEY
- [x] CLOUDINARY_API_SECRET
- [x] FRONTEND_URL (optional, defaults to http://localhost:5173)

### Frontend (.env)
- [x] VITE_API_URL

## Common Commands

### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Support

If you encounter any issues:
1. Check the environment variables are correctly set
2. Ensure both servers are running
3. Check browser console for errors
4. Check terminal output for errors
5. Verify MongoDB and Cloudinary connections
