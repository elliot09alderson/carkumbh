# API Integration Guide

## Overview

All API calls use a single axios instance configured in `axios.ts` with:
- **Single BaseURL**: `http://localhost:5000/api`
- **Auto Auth Headers**: JWT token automatically injected
- **Token Management**: Handles expiration and redirects
- **Error Handling**: Centralized error responses

## Architecture

```
api/
├── axios.ts       # Axios instance with interceptors
├── auth.ts        # Authentication endpoints
├── bookings.ts    # Booking endpoints
└── README.md      # This file
```

## How It Works

### 1. Axios Instance (`axios.ts`)

```typescript
import axios from 'axios';

// Single baseURL for all API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. Request Interceptor (Auto Auth Headers)

Automatically injects the JWT token from localStorage into every request:

```typescript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

**What this does:**
- Checks localStorage for `adminToken`
- If found, adds `Authorization: Bearer <token>` header
- Applied to ALL requests automatically
- No need to manually add headers in each API call

### 3. Response Interceptor (Token Expiration)

Handles 401 Unauthorized errors:

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin-login';
      }
    }
    return Promise.reject(error);
  }
);
```

**What this does:**
- Catches 401 errors (expired/invalid token)
- Removes token from localStorage
- Redirects to login page if on admin routes
- Prevents showing stale data

## Usage Examples

### Example 1: Creating an API Module

```typescript
// frontend/src/api/users.ts
import api from './axios';

export interface User {
  _id: string;
  name: string;
  email: string;
}

// GET request - auth header auto-injected
export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users');
  return data;
};

// POST request - auth header auto-injected
export const createUser = async (userData: Partial<User>): Promise<User> => {
  const { data } = await api.post('/users', userData);
  return data;
};

// PATCH request - auth header auto-injected
export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  const { data } = await api.patch(`/users/${id}`, updates);
  return data;
};

// DELETE request - auth header auto-injected
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
```

### Example 2: File Upload

```typescript
// frontend/src/api/uploads.ts
import api from './axios';

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.url;
};
```

### Example 3: Using in React Component

```typescript
import { useEffect, useState } from 'react';
import { getAllUsers, User } from '@/api/users';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(); // Auth header auto-injected!
      setUsers(data);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      // 401 already handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? 'Loading...' : users.map(user => (
        <div key={user._id}>{user.name}</div>
      ))}
    </div>
  );
};
```

## Current API Endpoints

### Authentication (`auth.ts`)
- `POST /auth/login` - Login and store token
- `POST /auth/setup` - Create admin (one-time)
- `GET /auth/profile` - Get admin profile (protected)

### Bookings (`bookings.ts`)
- `POST /bookings` - Create booking (public)
- `GET /bookings` - Get all bookings (protected)
- `PATCH /bookings/:id/toggle-paid` - Toggle payment (protected)
- `DELETE /bookings/:id` - Delete booking (protected)

## Token Flow

```
1. User logs in
   └─> POST /auth/login
       └─> Response: { token: "xyz..." }
           └─> Stored in localStorage as 'adminToken'

2. User makes protected request
   └─> GET /bookings
       └─> Interceptor adds: Authorization: Bearer xyz...
           └─> Backend validates token
               ├─> Valid: Returns data
               └─> Invalid: Returns 401
                   └─> Interceptor removes token
                       └─> Redirects to /admin-login

3. User logs out
   └─> logoutAdmin() called
       └─> localStorage.removeItem('adminToken')
           └─> Redirects to login
```

## Configuration

### Change API Base URL

Update `frontend/.env`:

```env
# Development
VITE_API_URL=http://localhost:5000/api

# Production
VITE_API_URL=https://api.yourdomain.com/api
```

### Change Token Storage Key

In `axios.ts`, `auth.ts`, and `AuthContext.tsx`, replace:
```typescript
localStorage.getItem('adminToken')
localStorage.setItem('adminToken', token)
localStorage.removeItem('adminToken')
```

## Adding New Endpoints

### Step 1: Create API Module

```typescript
// frontend/src/api/newFeature.ts
import api from './axios';

export interface NewFeature {
  _id: string;
  name: string;
}

export const getFeatures = async () => {
  const { data } = await api.get('/features');
  return data;
};
```

### Step 2: Use in Component

```typescript
import { getFeatures } from '@/api/newFeature';

const MyComponent = () => {
  // Use the API function
  const data = await getFeatures();
  // Auth headers automatically included!
};
```

## Benefits

✅ **Single Source of Truth**: One baseURL for all API calls
✅ **Auto Authentication**: No manual header management
✅ **Centralized Error Handling**: 401 errors handled automatically
✅ **Type Safety**: TypeScript interfaces for all endpoints
✅ **Easy Testing**: Mock the axios instance once
✅ **Maintainable**: Change baseURL in one place

## Troubleshooting

### Token not being sent
- Check localStorage has 'adminToken' key
- Verify axios instance is imported from './axios'
- Check browser console for CORS errors

### 401 errors even with valid token
- Check token hasn't expired (30 days default)
- Verify backend JWT_SECRET matches
- Check Authorization header format: `Bearer <token>`

### API calls to wrong URL
- Verify VITE_API_URL in .env
- Restart dev server after changing .env
- Check console for actual request URL

## Best Practices

1. **Always use the `api` instance** - Don't create new axios instances
2. **Export typed interfaces** - Define response types
3. **Handle errors in components** - Let interceptor handle 401
4. **Don't store sensitive data** - Only store token in localStorage
5. **Clear token on logout** - Always call logoutAdmin()

## Security Notes

- Token stored in localStorage (XSS vulnerable)
- Consider using httpOnly cookies for production
- JWT expires in 30 days (configurable in backend)
- Always use HTTPS in production
- Validate token on every protected route
