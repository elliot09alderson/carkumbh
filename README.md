# Car Kumbh - MERN Booking System

A full-stack MERN application for managing car booking services with admin authentication and payment tracking.

## Features

- **User Booking System**: Users can book car services with cash or online payment
- **Image Upload**: Online payments require screenshot upload (stored on Cloudinary)
- **Admin Dashboard**: Secure admin panel to view all bookings and manage payment status
- **Authentication**: JWT-based admin authentication
- **Real-time Updates**: Toggle payment status with instant database updates

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- TailwindCSS + shadcn/ui components
- Axios for API calls
- React Router for navigation
- Framer Motion for animations

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Multer for file uploads
- ES6 Modules

## Project Structure

```
carkumbh/
├── frontend/
│   ├── src/
│   │   ├── api/              # API integration
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── pages/            # Page components
│   │   └── ...
│   └── .env
├── backend/
│   ├── config/               # Database & Cloudinary config
│   ├── models/               # Mongoose models
│   ├── routes/               # Express routes
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Auth & upload middleware
│   ├── server.js             # Main server file
│   └── .env
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Cloudinary account

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `backend/.env`:
```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Admin Credentials
ADMIN_EMAIL=admin@carkumbh.com
ADMIN_PASSWORD=your_admin_password_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Initial Admin Setup

Before you can access the admin dashboard, you need to create an admin account:

### Option 1: Using API Endpoint (Recommended for first-time setup)

Send a POST request to `/api/auth/setup`:

```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@carkumbh.com",
    "password": "your_secure_password"
  }'
```

### Option 2: Using MongoDB directly

Insert an admin document manually in your MongoDB database.

## Usage

### User Flow
1. Visit `http://localhost:5173`
2. Fill in the booking form
3. Choose package (₹499 or ₹999)
4. Select payment mode (Cash or Online)
5. If online payment: scan QR code and upload screenshot
6. Submit and receive confirmation token

### Admin Flow
1. Visit `http://localhost:5173/admin-login`
2. Login with admin credentials
3. View all bookings in the dashboard
4. Toggle payment status for each booking
5. View uploaded payment screenshots
6. Export booking data as JSON

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/setup` - Create initial admin (use once)
- `GET /api/auth/profile` - Get admin profile (protected)

### Bookings
- `POST /api/bookings` - Create new booking (with optional image upload)
- `GET /api/bookings` - Get all bookings (admin only)
- `GET /api/bookings/:id` - Get single booking (admin only)
- `PATCH /api/bookings/:id/toggle-paid` - Toggle payment status (admin only)
- `DELETE /api/bookings/:id` - Delete booking (admin only)

### Health Check
- `GET /api/health` - Server health check

## Security Notes

- All admin routes are protected with JWT authentication
- Passwords are hashed using bcrypt
- File uploads are validated and limited to images only
- Maximum file size: 5MB
- CORS is configured to accept requests only from the frontend URL

## Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in your environment variables
2. Update `FRONTEND_URL` to your production frontend URL
3. Use a production-ready MongoDB instance
4. Deploy to platforms like Railway, Render, or Heroku

### Frontend Deployment
1. Update `VITE_API_URL` to your production backend URL
2. Build the frontend: `npm run build`
3. Deploy the `dist` folder to platforms like Vercel, Netlify, or Cloudflare Pages

## Important Notes

- **Security**: Remove or protect the `/api/auth/setup` endpoint after creating your first admin
- **Images**: Payment screenshots are stored on Cloudinary and linked to bookings
- **Database**: All bookings are stored in MongoDB (no localStorage in production)
- **Tokens**: Booking tokens are unique 6-character alphanumeric strings

## Development

- Backend runs on port 5000 (configurable via PORT env variable)
- Frontend runs on port 5173 (Vite default)
- Hot reload enabled for both frontend and backend in development mode

## Support

For issues or questions, please check:
1. Environment variables are correctly set
2. MongoDB connection is active
3. Cloudinary credentials are valid
4. Both frontend and backend servers are running
