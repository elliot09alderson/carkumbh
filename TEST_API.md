# Testing the API with Auto-Injected Auth Headers

## Quick Test Checklist

### ✅ Step 1: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm install  # if not done
npm run dev
```

Expected output:
```
Server running in development mode on port 5000
MongoDB Connected: cluster.mongodb.net
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # if not done
npm run dev
```

Expected output:
```
VITE ready in XXX ms
➜  Local: http://localhost:5173/
```

---

### ✅ Step 2: Create Admin Account

**Using cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@carkumbh.com",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "_id": "675d...",
  "email": "admin@carkumbh.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### ✅ Step 3: Test User Booking (Public - No Auth)

1. Open browser: `http://localhost:5173`
2. Fill in the booking form:
   - Name: Test User
   - Number: 9876543210
   - Address: 123 Test Street
   - Package: ₹499
   - Payment: Cash
3. Click "Confirm Booking"

**Expected Result:**
- ✅ Success toast appears
- ✅ Token displayed: "ABC123" (random)
- ✅ Saved to MongoDB

**Check in Browser Console:**
```javascript
// Network tab should show:
POST http://localhost:5000/api/bookings
Status: 201 Created
Response: { token: "ABC123", name: "Test User", ... }
```

**No Authorization header** - this is a public endpoint!

---

### ✅ Step 4: Test Admin Login (Gets Token)

1. Go to: `http://localhost:5173/admin-login`
2. Enter credentials:
   - Email: admin@carkumbh.com
   - Password: admin123
3. Click "Login"

**Expected Result:**
- ✅ Redirects to `/admin`
- ✅ Token stored in localStorage

**Check in Browser Console:**
```javascript
localStorage.getItem('adminToken')
// Should return: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Check Network Tab:**
```
POST http://localhost:5000/api/auth/login
Status: 200 OK
Response: {
  "_id": "675d...",
  "email": "admin@carkumbh.com",
  "token": "eyJhbGc..."
}
```

---

### ✅ Step 5: Test Protected Endpoint (Auto Auth Header)

Now you're on `/admin` dashboard.

**Check Network Tab:**
```
GET http://localhost:5000/api/bookings
Request Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ← AUTOMATICALLY ADDED!
  Content-Type: application/json

Status: 200 OK
Response: [
  { "_id": "...", "token": "ABC123", "name": "Test User", ... }
]
```

**The magic:** You didn't manually add the Authorization header - the request interceptor did it!

---

### ✅ Step 6: Test Toggle Payment Status (With Auth)

1. On the admin dashboard, toggle the payment switch
2. Watch the Network tab

**Expected Network Call:**
```
PATCH http://localhost:5000/api/bookings/675d.../toggle-paid
Request Headers:
  Authorization: Bearer eyJhbGc...  ← AUTO-INJECTED!
  Content-Type: application/json

Status: 200 OK
Response: { "_id": "...", "isPaid": true, ... }
```

---

### ✅ Step 7: Test Token Expiration

**Simulate expired token:**

1. Open browser console
2. Set a fake token:
```javascript
localStorage.setItem('adminToken', 'invalid_token_12345')
```
3. Refresh the page
4. Try to toggle payment status

**Expected Result:**
- ❌ Backend returns 401 Unauthorized
- ✅ Response interceptor catches it
- ✅ Removes token from localStorage
- ✅ Redirects to `/admin-login`

**Check Network Tab:**
```
PATCH http://localhost:5000/api/bookings/.../toggle-paid
Request Headers:
  Authorization: Bearer invalid_token_12345

Status: 401 Unauthorized
Response: { "message": "Not authorized, token failed" }
```

**Check Console:**
```
// You should be redirected to /admin-login
window.location.pathname === '/admin-login'  // true
localStorage.getItem('adminToken')           // null
```

---

## Testing with Browser DevTools

### Check Request Headers

1. Open DevTools (F12)
2. Go to Network tab
3. Make an admin action (toggle payment)
4. Click on the request
5. View "Headers" tab
6. Look for "Request Headers"

**You should see:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Check localStorage

**In Console:**
```javascript
// View token
localStorage.getItem('adminToken')

// Decode JWT payload (doesn't verify, just reads)
const token = localStorage.getItem('adminToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);

// Should show:
{
  id: "675d...",
  iat: 1734123456,
  exp: 1736715456
}
```

### Watch Interceptors in Action

**In Console, add logging:**
```javascript
// Add this in axios.ts temporarily for debugging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  console.log('🚀 REQUEST:', config.method.toUpperCase(), config.url);
  console.log('🔑 Token:', token ? 'Present ✅' : 'Missing ❌');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✨ Added Authorization header');
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ SUCCESS:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.log('❌ ERROR:', error.config.url, error.response?.status);
    if (error.response?.status === 401) {
      console.log('🔐 Unauthorized - removing token and redirecting');
      localStorage.removeItem('adminToken');
      window.location.href = '/admin-login';
    }
    return Promise.reject(error);
  }
);
```

**Then make API calls and watch the logs!**

---

## Testing with cURL

### 1. Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@carkumbh.com","password":"admin123"}' \
  | jq -r '.token'
```

Save the token in a variable:
```bash
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@carkumbh.com","password":"admin123"}' \
  | jq -r '.token')

echo $TOKEN
```

### 2. Use Token for Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 3. Toggle Payment Status
```bash
BOOKING_ID="675d..."  # Replace with actual booking ID

curl -X PATCH http://localhost:5000/api/bookings/$BOOKING_ID/toggle-paid \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 4. Test Invalid Token
```bash
curl -X GET http://localhost:5000/api/bookings \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json"
```

Expected:
```json
{
  "message": "Not authorized, token failed"
}
```

---

## Common Issues & Solutions

### Issue: No Authorization header sent
**Solution:**
- Check localStorage has 'adminToken'
- Verify you're using `api` from `./axios`, not a different axios instance
- Check the request in Network tab

### Issue: 401 even with valid token
**Solution:**
- Check backend JWT_SECRET matches
- Verify token hasn't expired (30 days)
- Check backend middleware is properly configured

### Issue: Token not stored after login
**Solution:**
- Check `loginAdmin()` in auth.ts
- Verify it calls `localStorage.setItem('adminToken', data.token)`
- Check for JavaScript errors in console

### Issue: Not redirected on 401
**Solution:**
- Check response interceptor in axios.ts
- Verify error.response.status === 401 check
- Check browser console for errors

---

## Success Checklist

After following all steps, you should have:

- [x] Backend running on port 5000
- [x] Frontend running on port 5173
- [x] Admin account created
- [x] Token stored in localStorage after login
- [x] All admin API calls include Authorization header automatically
- [x] 401 errors redirect to login automatically
- [x] No manual header management in components

## Summary

**The key point:** With the axios interceptor setup, you **NEVER** need to manually add auth headers in your components. Just call the API functions and the interceptor handles everything automatically!

```typescript
// This is all you need in your components:
const bookings = await getAllBookings();  // Auth header added automatically!
const updated = await togglePaidStatus(id); // Auth header added automatically!
```

No need for:
```typescript
// ❌ Don't do this:
const token = localStorage.getItem('adminToken');
const bookings = await axios.get('/bookings', {
  headers: { Authorization: `Bearer ${token}` }
});
```

The interceptor does it for you! 🎉
