# MERN App Architecture - Auto-Injected Auth Headers

## Overview

This application uses a **single axios instance** with **interceptors** to automatically inject authentication headers on every protected API call. No manual header management needed in components.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components (Admin.tsx, BookingForm.tsx, etc.)           │  │
│  │  - Just call API functions                               │  │
│  │  - No auth header code                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │ calls                               │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Layer (auth.ts, bookings.ts)                        │  │
│  │  - Defines endpoints                                      │  │
│  │  - Uses shared axios instance                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │ uses                                │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Axios Instance (axios.ts)                               │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ baseURL: http://localhost:5000/api                 │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ REQUEST INTERCEPTOR                                │  │  │
│  │  │ • Get token from localStorage                      │  │  │
│  │  │ • Inject Authorization: Bearer <token>             │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ RESPONSE INTERCEPTOR                               │  │  │
│  │  │ • Catch 401 errors                                 │  │  │
│  │  │ • Remove token                                     │  │  │
│  │  │ • Redirect to login                                │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           │ HTTP Request with auth header        │
│                           ▼                                      │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Authorization: Bearer xyz...
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Auth Middleware (middleware/auth.js)                    │  │
│  │  • Extract token from header                             │  │
│  │  • Verify JWT signature                                  │  │
│  │  • Attach admin to req.admin                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼ if valid                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Controllers (bookingController.js, authController.js)   │  │
│  │  • Access req.admin (authenticated user)                 │  │
│  │  • Perform business logic                                │  │
│  │  • Return response                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MongoDB                                                  │  │
│  │  • admins collection                                      │  │
│  │  • bookings collection                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
carkumbh/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.ts           ← Single axios instance with interceptors
│   │   │   ├── auth.ts            ← Auth endpoints (login, logout)
│   │   │   ├── bookings.ts        ← Booking endpoints (CRUD)
│   │   │   └── README.md          ← API usage guide
│   │   │
│   │   ├── components/
│   │   │   └── BookingForm.tsx    ← Calls API, no auth code
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx    ← Manages auth state
│   │   │
│   │   ├── pages/
│   │   │   ├── Admin.tsx          ← Protected page
│   │   │   ├── AdminLogin.tsx     ← Login page
│   │   │   └── Index.tsx          ← Public page
│   │   │
│   │   └── App.tsx                ← Routes & providers
│   │
│   └── .env                       ← VITE_API_URL
│
└── backend/
    ├── config/
    │   ├── db.js                  ← MongoDB connection
    │   └── cloudinary.js          ← Cloudinary setup
    │
    ├── middleware/
    │   ├── auth.js                ← JWT verification middleware
    │   └── upload.js              ← Multer + Cloudinary upload
    │
    ├── models/
    │   ├── Admin.js               ← Admin schema (bcrypt)
    │   └── Booking.js             ← Booking schema
    │
    ├── controllers/
    │   ├── authController.js      ← Login, setup, profile
    │   └── bookingController.js   ← CRUD operations
    │
    ├── routes/
    │   ├── auth.js                ← /api/auth/*
    │   └── bookings.js            ← /api/bookings/*
    │
    ├── server.js                  ← Express app
    └── .env                       ← MongoDB, JWT, Cloudinary
```

## Key Components

### 1. Frontend - Axios Instance (axios.ts)

**Single source of truth for all API calls**

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,  // ← Single baseURL for all calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// AUTO-INJECT AUTH HEADERS
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // ← Magic happens here
  }
  return config;
});

// AUTO-HANDLE TOKEN EXPIRATION
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin-login';  // ← Auto logout
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Frontend - API Layer (bookings.ts)

**Clean API functions using shared axios instance**

```typescript
import api from './axios';  // ← Uses interceptor-enabled instance

// All these automatically include auth headers if token exists
export const getAllBookings = async () => {
  const { data } = await api.get('/bookings');
  return data;
};

export const togglePaidStatus = async (id: string) => {
  const { data } = await api.patch(`/bookings/${id}/toggle-paid`);
  return data;
};

export const deleteBooking = async (id: string) => {
  await api.delete(`/bookings/${id}`);
};
```

### 3. Frontend - Component (Admin.tsx)

**No auth code in components!**

```typescript
import { getAllBookings, togglePaidStatus } from '@/api/bookings';

const Admin = () => {
  const loadBookings = async () => {
    try {
      // Clean! No token management, no headers!
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load');
      // 401 already handled by interceptor
    }
  };

  const togglePayment = async (id: string) => {
    try {
      // Still clean! No auth code!
      const updated = await togglePaidStatus(id);
      setBookings(bookings.map(b => b._id === id ? updated : b));
    } catch (error) {
      console.error('Failed to toggle');
    }
  };

  return (
    <div>
      {bookings.map(booking => (
        <Switch
          checked={booking.isPaid}
          onCheckedChange={() => togglePayment(booking._id)}
        />
      ))}
    </div>
  );
};
```

### 4. Backend - Auth Middleware (auth.js)

**Validates JWT token from header**

```javascript
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach admin to request
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ message: 'Admin not found' });
      }

      next();  // ← Token valid, proceed to controller
    } catch (error) {
      return res.status(401).json({ message: 'Token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token' });
  }
};
```

### 5. Backend - Protected Routes (bookings.js)

**Apply middleware to protect routes**

```javascript
import express from 'express';
import { protect } from '../middleware/auth.js';
import { getAllBookings, togglePaidStatus } from '../controllers/bookingController.js';

const router = express.Router();

// Public route (no middleware)
router.post('/', upload.single('screenshot'), createBooking);

// Protected routes (with protect middleware)
router.get('/', protect, getAllBookings);              // ← Admin only
router.patch('/:id/toggle-paid', protect, togglePaidStatus);  // ← Admin only

export default router;
```

## Data Flow Example

### Scenario: Admin toggles payment status

```
1. User clicks toggle switch
   └─> Admin.tsx: togglePayment('675d123...')
       └─> bookings.ts: togglePaidStatus('675d123...')
           └─> api.patch('/bookings/675d123.../toggle-paid')

2. Request Interceptor runs
   └─> Get token from localStorage: 'eyJhbGc...'
   └─> Add header: Authorization: Bearer eyJhbGc...

3. HTTP Request sent
   └─> PATCH http://localhost:5000/api/bookings/675d123.../toggle-paid
   └─> Headers: { Authorization: 'Bearer eyJhbGc...', Content-Type: 'application/json' }

4. Backend receives request
   └─> Express routes to: router.patch('/:id/toggle-paid', protect, togglePaidStatus)
   └─> Middleware: protect() runs first
       └─> Extract token from header
       └─> Verify JWT: jwt.verify(token, process.env.JWT_SECRET)
       └─> Find admin: Admin.findById(decoded.id)
       └─> Attach to request: req.admin = admin
       └─> Call next()

5. Controller executes
   └─> togglePaidStatus(req, res)
       └─> Access authenticated admin: req.admin
       └─> Find booking: Booking.findById(req.params.id)
       └─> Toggle: booking.isPaid = !booking.isPaid
       └─> Save: booking.save()
       └─> Return: res.json(updatedBooking)

6. Response Interceptor runs
   └─> Status: 200 OK
   └─> Pass through: return response

7. Component receives data
   └─> bookings.ts returns: updatedBooking
   └─> Admin.tsx updates state: setBookings(...)
   └─> UI re-renders with new data
```

## Benefits of This Architecture

### ✅ 1. Clean Component Code
```typescript
// ❌ Without interceptors
const loadBookings = async () => {
  const token = localStorage.getItem('adminToken');
  const response = await axios.get('http://localhost:5000/api/bookings', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = response.data;
  setBookings(data);
};

// ✅ With interceptors
const loadBookings = async () => {
  const data = await getAllBookings();
  setBookings(data);
};
```

### ✅ 2. Single Source of Truth
- One baseURL: `axios.ts`
- One auth header logic: Request interceptor
- One error handling: Response interceptor

### ✅ 3. Automatic Token Management
- Login → token stored
- API call → token injected
- 401 error → token removed + redirect

### ✅ 4. Type Safety
```typescript
// All API functions are typed
const bookings: Booking[] = await getAllBookings();
const updated: Booking = await togglePaidStatus(id);
```

### ✅ 5. Easy Testing
```typescript
// Mock the axios instance once
jest.mock('@/api/axios');

// All API functions use the mocked instance
const data = await getAllBookings();  // Uses mock
```

### ✅ 6. Centralized Error Handling
```typescript
// 401 handled once in interceptor
// Components don't need to check for token expiration
try {
  const data = await getAllBookings();
} catch (error) {
  // Just handle business logic errors
  // Auth errors already handled
}
```

## Security Considerations

1. **Token Storage**: Currently in localStorage (XSS vulnerable)
   - Consider httpOnly cookies for production

2. **Token Expiration**: 30 days (configurable)
   - Handled automatically by interceptor

3. **HTTPS**: Required in production
   - Protects token in transit

4. **CORS**: Configured in backend
   - Only allows requests from frontend URL

5. **Input Validation**: Backend validates all inputs
   - Express-validator can be added

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=http://localhost:5173
```

## Summary

This architecture provides:
- ✅ **Single axios instance** for all API calls
- ✅ **Auto-injected auth headers** via request interceptor
- ✅ **Auto token expiration handling** via response interceptor
- ✅ **Clean component code** - no auth logic in UI
- ✅ **Type-safe API layer** - TypeScript interfaces
- ✅ **Centralized error handling** - one place for 401
- ✅ **Easy to maintain** - change auth logic in one file

**Result:** Components just call API functions, everything else is handled automatically! 🎉
