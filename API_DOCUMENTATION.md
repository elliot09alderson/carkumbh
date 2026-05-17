# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### 1. Create Admin (First Time Setup)
**POST** `/auth/setup`

**Request Body:**
```json
{
  "email": "admin@carkumbh.com",
  "password": "YourSecurePassword123"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "admin@carkumbh.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** This endpoint should be protected or removed after creating the first admin.

---

### 2. Admin Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "admin@carkumbh.com",
  "password": "YourSecurePassword123"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "admin@carkumbh.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** Save the token for authenticated requests.

---

### 3. Get Admin Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "admin@carkumbh.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Booking Endpoints

### 4. Create Booking (Public)
**POST** `/bookings`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `name` (string, required): Customer name
- `number` (string, required): Phone number
- `address` (string, required): Address
- `package` (string, required): "499" or "999"
- `paymentMode` (string, required): "cash" or "online"
- `screenshot` (file, optional): Payment screenshot (required if paymentMode is "online")

**Example using cURL:**
```bash
# Cash payment
curl -X POST http://localhost:5000/api/bookings \
  -F "name=John Doe" \
  -F "number=9876543210" \
  -F "address=123 Main St" \
  -F "package=499" \
  -F "paymentMode=cash"

# Online payment with screenshot
curl -X POST http://localhost:5000/api/bookings \
  -F "name=John Doe" \
  -F "number=9876543210" \
  -F "address=123 Main St" \
  -F "package=999" \
  -F "paymentMode=online" \
  -F "screenshot=@/path/to/screenshot.jpg"
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "token": "ABC123",
  "name": "John Doe",
  "number": "9876543210",
  "address": "123 Main St",
  "package": "499",
  "paymentMode": "cash",
  "isPaid": false,
  "screenshotUrl": null,
  "screenshotPublicId": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 5. Get All Bookings (Admin Only)
**GET** `/bookings`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "token": "ABC123",
    "name": "John Doe",
    "number": "9876543210",
    "address": "123 Main St",
    "package": "499",
    "paymentMode": "cash",
    "isPaid": false,
    "screenshotUrl": null,
    "screenshotPublicId": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "token": "XYZ789",
    "name": "Jane Smith",
    "number": "8765432109",
    "address": "456 Oak Ave",
    "package": "999",
    "paymentMode": "online",
    "isPaid": true,
    "screenshotUrl": "https://res.cloudinary.com/...",
    "screenshotPublicId": "carkumbh/payment-screenshots/xyz",
    "createdAt": "2024-01-01T01:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
]
```

---

### 6. Get Single Booking (Admin Only)
**GET** `/bookings/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "token": "ABC123",
  "name": "John Doe",
  "number": "9876543210",
  "address": "123 Main St",
  "package": "499",
  "paymentMode": "cash",
  "isPaid": false,
  "screenshotUrl": null,
  "screenshotPublicId": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 7. Toggle Payment Status (Admin Only)
**PATCH** `/bookings/:id/toggle-paid`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Example:**
```bash
curl -X PATCH http://localhost:5000/api/bookings/507f1f77bcf86cd799439012/toggle-paid \
  -H "Authorization: Bearer <your-token-here>"
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "token": "ABC123",
  "name": "John Doe",
  "number": "9876543210",
  "address": "123 Main St",
  "package": "499",
  "paymentMode": "cash",
  "isPaid": true,
  "screenshotUrl": null,
  "screenshotPublicId": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 8. Delete Booking (Admin Only)
**DELETE** `/bookings/:id`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/bookings/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <your-token-here>"
```

**Response:**
```json
{
  "message": "Booking removed"
}
```

**Note:** This will also delete the associated screenshot from Cloudinary if it exists.

---

## Health Check

### 9. Server Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

### 400 Bad Request
```json
{
  "message": "Please fill in all required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 404 Not Found
```json
{
  "message": "Booking not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error uploading screenshot",
  "error": {} // Only in development mode
}
```

---

## Testing with Postman

### Setup
1. Import the following as environment variables:
   - `BASE_URL`: `http://localhost:5000/api`
   - `ADMIN_TOKEN`: (empty initially)

### Workflow
1. **Create Admin**: POST to `{{BASE_URL}}/auth/setup`
2. **Login**: POST to `{{BASE_URL}}/auth/login` and save the token
3. **Set Token**: Update `ADMIN_TOKEN` with the received token
4. **Create Booking**: POST to `{{BASE_URL}}/bookings` with form-data
5. **View Bookings**: GET `{{BASE_URL}}/bookings` with Authorization header
6. **Toggle Status**: PATCH `{{BASE_URL}}/bookings/:id/toggle-paid`

### Authorization Header Format
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Rate Limiting & Security

- No rate limiting implemented (add in production)
- File upload limited to 5MB
- Only image files accepted for screenshots
- CORS enabled for frontend URL
- JWT tokens expire in 30 days
- Passwords hashed with bcrypt (10 rounds)

---

## Development Notes

- All timestamps are in ISO 8601 format (UTC)
- Booking tokens are 6-character alphanumeric strings
- MongoDB ObjectIds are used for all `_id` fields
- Cloudinary URLs are permanent (delete booking to remove image)
- Payment status defaults to `false` for cash, `true` for online

---

## Production Considerations

1. Add rate limiting
2. Implement request validation with express-validator
3. Add logging (morgan, winston)
4. Secure the `/auth/setup` endpoint
5. Add pagination for `/bookings` endpoint
6. Implement refresh tokens
7. Add API versioning
8. Use HTTPS in production
9. Add request/response compression
10. Implement proper error tracking
