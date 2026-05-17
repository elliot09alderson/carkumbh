# Authentication Flow with Auto-Injected Headers

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AXIOS INSTANCE SETUP                        │
│                         (frontend/src/api/axios.ts)                 │
│                                                                     │
│  const api = axios.create({                                        │
│    baseURL: 'http://localhost:5000/api',                          │
│    headers: { 'Content-Type': 'application/json' }                │
│  });                                                               │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      REQUEST INTERCEPTOR                            │
│                  (Runs BEFORE every API call)                       │
│                                                                     │
│  api.interceptors.request.use((config) => {                        │
│    const token = localStorage.getItem('adminToken');               │
│    if (token) {                                                    │
│      config.headers.Authorization = `Bearer ${token}`;             │
│    }                                                               │
│    return config;                                                  │
│  });                                                               │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API REQUEST MADE                            │
│                                                                     │
│  Examples:                                                         │
│  • api.get('/bookings')                                           │
│  • api.post('/bookings', data)                                    │
│  • api.patch('/bookings/:id/toggle-paid')                         │
│                                                                     │
│  Authorization: Bearer xyz123... ← AUTOMATICALLY ADDED!            │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND VALIDATES                           │
│                  (backend/middleware/auth.js)                       │
│                                                                     │
│  const token = req.headers.authorization.split(' ')[1];           │
│  const decoded = jwt.verify(token, process.env.JWT_SECRET);       │
│  req.admin = await Admin.findById(decoded.id);                    │
└─────────────────────────────────────────────────────────────────────┘
                        │                       │
                        ▼                       ▼
            ┌──────────────────┐    ┌──────────────────┐
            │  Token Valid     │    │  Token Invalid   │
            │  Return Data     │    │  Return 401      │
            └──────────────────┘    └──────────────────┘
                        │                       │
                        ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      RESPONSE INTERCEPTOR                           │
│                   (Runs AFTER every API call)                       │
│                                                                     │
│  api.interceptors.response.use(                                    │
│    (response) => response,  // Success path                        │
│    (error) => {                                                    │
│      if (error.response?.status === 401) {                        │
│        localStorage.removeItem('adminToken');                     │
│        window.location.href = '/admin-login';                     │
│      }                                                             │
│      return Promise.reject(error);                                │
│    }                                                               │
│  );                                                                │
└─────────────────────────────────────────────────────────────────────┘
                        │                       │
                        ▼                       ▼
            ┌──────────────────┐    ┌──────────────────┐
            │  Success         │    │  Redirect        │
            │  Return to UI    │    │  to Login        │
            └──────────────────┘    └──────────────────┘
```

## Detailed Authentication Flow

### 1. Admin Login
```
User enters credentials
         │
         ▼
┌─────────────────────┐
│ AdminLogin.tsx      │
│ handleSubmit()      │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ auth.ts             │
│ loginAdmin()        │
└─────────────────────┘
         │
         ▼ api.post('/auth/login', { email, password })
         │ (NO auth header needed - public endpoint)
         │
         ▼
┌─────────────────────┐
│ Backend             │
│ POST /auth/login    │
│ Validates password  │
└─────────────────────┘
         │
         ▼ Returns: { _id, email, token }
         │
         ▼
┌─────────────────────┐
│ localStorage        │
│ .setItem(           │
│   'adminToken',     │
│   token             │
│ )                   │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ AuthContext         │
│ setIsAuth(true)     │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Navigate to         │
│ /admin              │
└─────────────────────┘
```

### 2. Protected API Call
```
Admin clicks on something
         │
         ▼
┌─────────────────────┐
│ Admin.tsx           │
│ loadBookings()      │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ bookings.ts         │
│ getAllBookings()    │
└─────────────────────┘
         │
         ▼ api.get('/bookings')
         │
         ▼
┌─────────────────────────────────────┐
│ REQUEST INTERCEPTOR                 │
│ 1. Get token from localStorage      │
│ 2. Add to headers                   │
│    Authorization: Bearer xyz...     │
└─────────────────────────────────────┘
         │
         ▼ HTTP Request with auth header
         │
         ▼
┌─────────────────────────────────────┐
│ Backend Middleware                  │
│ 1. Extract token from header        │
│ 2. Verify with JWT                  │
│ 3. Attach admin to req.admin        │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Controller                          │
│ const bookings = await Booking      │
│   .find({})                         │
│   .sort({ createdAt: -1 });        │
│ res.json(bookings);                 │
└─────────────────────────────────────┘
         │
         ▼ Returns bookings array
         │
         ▼
┌─────────────────────────────────────┐
│ RESPONSE INTERCEPTOR                │
│ Success - pass through              │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Admin.tsx                           │
│ setBookings(data)                   │
│ Display in UI                       │
└─────────────────────────────────────┘
```

### 3. Token Expiration
```
Admin makes API call (token expired)
         │
         ▼
┌─────────────────────────────────────┐
│ REQUEST INTERCEPTOR                 │
│ Adds expired token to header        │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Backend Middleware                  │
│ jwt.verify() FAILS                  │
│ Returns 401 Unauthorized            │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ RESPONSE INTERCEPTOR                │
│ 1. Detect 401 error                 │
│ 2. Remove token from localStorage   │
│ 3. Redirect to /admin-login         │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ AdminLogin.tsx                      │
│ User must login again               │
└─────────────────────────────────────┘
```

## Code Examples

### Example 1: Making a Protected API Call

**Component Code:**
```typescript
// frontend/src/pages/Admin.tsx
import { getAllBookings } from '@/api/bookings';

const Admin = () => {
  const loadBookings = async () => {
    try {
      // Just call the function - auth header added automatically!
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings');
    }
  };

  // No need to pass token or add headers manually!
};
```

**What happens behind the scenes:**
```typescript
// 1. getAllBookings() is called
export const getAllBookings = async (): Promise<Booking[]> => {
  const { data } = await api.get('/bookings');
  return data;
};

// 2. Request interceptor runs AUTOMATICALLY
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken'); // Gets: "eyJhbGc..."
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Adds header
  }
  return config;
});

// 3. Actual HTTP request sent:
GET http://localhost:5000/api/bookings
Headers:
  Authorization: Bearer eyJhbGc...
  Content-Type: application/json

// 4. Backend receives and validates
const token = req.headers.authorization.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// If valid, returns data
// If invalid, returns 401

// 5. Response interceptor runs
api.interceptors.response.use(
  (response) => response, // Success - return data
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout and redirect
      localStorage.removeItem('adminToken');
      window.location.href = '/admin-login';
    }
    return Promise.reject(error);
  }
);
```

### Example 2: Toggle Payment Status

**Component Code:**
```typescript
// frontend/src/pages/Admin.tsx
import { togglePaidStatus } from '@/api/bookings';

const togglePayment = async (bookingId: string) => {
  try {
    // Just call - auth handled automatically!
    const updated = await togglePaidStatus(bookingId);
    setBookings(bookings.map(b =>
      b._id === bookingId ? updated : b
    ));
  } catch (error) {
    console.error('Failed to toggle status');
  }
};
```

**What happens:**
```typescript
// 1. Function called
export const togglePaidStatus = async (id: string): Promise<Booking> => {
  const { data } = await api.patch(`/bookings/${id}/toggle-paid`);
  return data;
};

// 2. Request interceptor adds token automatically
PATCH http://localhost:5000/api/bookings/507f.../toggle-paid
Headers:
  Authorization: Bearer eyJhbGc...  ← ADDED AUTOMATICALLY!
  Content-Type: application/json

// 3. Backend validates and updates
// 4. Returns updated booking
```

## Key Advantages

### ✅ No Manual Header Management
```typescript
// ❌ WITHOUT interceptor (manual)
const getAllBookings = async () => {
  const token = localStorage.getItem('adminToken');
  const { data } = await axios.get('/bookings', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

// ✅ WITH interceptor (automatic)
const getAllBookings = async () => {
  const { data } = await api.get('/bookings');
  return data;
};
```

### ✅ Centralized Error Handling
```typescript
// ❌ WITHOUT interceptor (manual in every component)
try {
  const data = await getAllBookings();
} catch (error) {
  if (error.response?.status === 401) {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  }
}

// ✅ WITH interceptor (automatic everywhere)
try {
  const data = await getAllBookings();
} catch (error) {
  console.error('Failed'); // 401 already handled!
}
```

### ✅ Single Source of Truth
```typescript
// All API calls use the same baseURL
import api from './axios';

// These all use http://localhost:5000/api
api.get('/bookings')       → http://localhost:5000/api/bookings
api.post('/auth/login')    → http://localhost:5000/api/auth/login
api.patch('/bookings/123') → http://localhost:5000/api/bookings/123
```

## Summary

1. **One axios instance** (`api`) for all calls
2. **Single baseURL** configured in one place
3. **Request interceptor** auto-injects auth token
4. **Response interceptor** handles token expiration
5. **Components** just call API functions - no auth code needed
6. **Automatic logout** when token expires

This architecture makes the code cleaner, more maintainable, and less error-prone!
