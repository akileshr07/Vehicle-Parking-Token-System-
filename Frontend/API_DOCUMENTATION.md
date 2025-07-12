# Vehicle Parking System - API Documentation

## 🚀 Spring Boot REST API Integration Guide

This document outlines all the API endpoints needed for the Vehicle Parking System frontend integration.

---

## 🔐 Authentication APIs

### 1. Admin Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "Admin",
  "password": "admin@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "Admin",
    "role": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Used in:** `src/auth/AuthProvider.jsx`

---

## 🏗️ Configuration APIs

### 2. Get Parking Configuration
**Endpoint:** `GET /api/config/parking`

**Success Response (200):**
```json
{
  "slots": {
    "car": 30,
    "bike": 20,
    "ev": 10
  },
  "fees": {
    "car": 20,
    "bike": 10,
    "ev": 15
  }
}
```

**Used in:** `src/pages/admin/ParkingConfig.jsx`

### 3. Update Parking Slots
**Endpoint:** `POST /api/config/parking/slots`

**Request Body:**
```json
{
  "car": 30,
  "bike": 20,
  "ev": 10
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Parking slots updated successfully"
}
```

**Used in:** `src/pages/admin/ParkingConfig.jsx`

### 4. Update Parking Fees
**Endpoint:** `POST /api/config/parking/fees`

**Request Body:**
```json
{
  "car": 20,
  "bike": 10,
  "ev": 15
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Parking fees updated successfully"
}
```

**Used in:** `src/pages/admin/ParkingConfig.jsx`

### 5. Get Payment Settings
**Endpoint:** `GET /api/config/payment`

**Success Response (200):**
```json
{
  "upiId": "9862113746@jio",
  "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Used in:** `src/pages/admin/PaymentSettings.jsx`

### 6. Update Payment Settings
**Endpoint:** `POST /api/config/payment`

**Request Body:**
```json
{
  "upiId": "9862113746@jio"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment settings updated successfully",
  "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Used in:** `src/pages/admin/PaymentSettings.jsx`

---

## 🚗 Vehicle Management APIs

### 7. Get All Vehicles
**Endpoint:** `GET /api/vehicles`

**Query Parameters:**
- `type` (optional): `car`, `bike`, `ev`, `all`
- `sort` (optional): `newest`, `oldest`
- `search` (optional): search by vehicle number or token

**Success Response (200):**
```json
{
  "vehicles": [
    {
      "id": 1,
      "type": "car",
      "number": "TN01AB1234",
      "entryTime": "2024-01-15T10:00:00Z",
      "token": "ABC123",
      "location": "Lot A - Section 1",
      "status": "active"
    },
    {
      "id": 2,
      "type": "bike",
      "number": "TN02CD5678",
      "entryTime": "2024-01-15T11:30:00Z",
      "token": "DEF456",
      "location": "Lot B - Section 2",
      "status": "active"
    }
  ],
  "total": 156,
  "active": 89
}
```

**Used in:** `src/pages/admin/VehicleManager.jsx`

### 8. Delete Vehicle
**Endpoint:** `DELETE /api/vehicles/{vehicleId}`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Vehicle not found"
}
```

**Used in:** `src/pages/admin/VehicleManager.jsx`

### 9. Add New Vehicle (Entry)
**Endpoint:** `POST /api/vehicles/entry`

**Request Body:**
```json
{
  "type": "car",
  "number": "TN01AB1234"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Vehicle entry recorded successfully",
  "vehicle": {
    "id": 1,
    "type": "car",
    "number": "TN01AB1234",
    "entryTime": "2024-01-15T10:00:00Z",
    "token": "ABC123",
    "location": "Lot A - Section 1",
    "status": "active"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "No available slots for this vehicle type"
}
```

---

## 🎫 Token Management APIs

### 10. Get Token Details
**Endpoint:** `GET /api/parking/{token}`

**Success Response (200):**
```json
{
  "token": "ABC123",
  "vehicleType": "car",
  "vehicleNumber": "TN01AB1234",
  "entryTime": "2024-01-15T10:00:00Z",
  "location": "Lot A - Section 1",
  "status": "active",
  "fees": 60,
  "hoursParked": 3,
  "qrCodeData": "upi://pay?pa=9862113746@jio&am=60&tn=ParkingFee-ABC123"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Token not found"
}
```

**Used in:** 
- `src/pages/admin/TokenManager.jsx`
- `src/pages/client/TokenLookup.jsx`

### 11. Exit Vehicle
**Endpoint:** `POST /api/parking/exit/{token}`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Vehicle exited successfully",
  "receipt": {
    "token": "ABC123",
    "vehicleNumber": "TN01AB1234",
    "entryTime": "2024-01-15T10:00:00Z",
    "exitTime": "2024-01-15T13:00:00Z",
    "totalHours": 3,
    "totalFees": 60,
    "paymentStatus": "pending"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Vehicle already exited or token not found"
}
```

**Used in:** `src/pages/admin/TokenManager.jsx`

---

## 📊 Dashboard & Statistics APIs

### 12. Get Dashboard Statistics
**Endpoint:** `GET /api/dashboard/stats`

**Success Response (200):**
```json
{
  "totalVehicles": 156,
  "activeTokens": 89,
  "availableSlots": 44,
  "todayRevenue": 2450,
  "parkingStatus": {
    "car": {
      "available": 15,
      "total": 30,
      "occupied": 15
    },
    "bike": {
      "available": 8,
      "total": 20,
      "occupied": 12
    },
    "ev": {
      "available": 4,
      "total": 10,
      "occupied": 6
    }
  }
}
```

**Used in:** `src/pages/admin/Dashboard.jsx`

### 13. Get Parking Status (Public)
**Endpoint:** `GET /api/public/parking-status`

**Success Response (200):**
```json
{
  "car": {
    "available": 15,
    "total": 30,
    "fee": 20
  },
  "bike": {
    "available": 8,
    "total": 20,
    "fee": 10
  },
  "ev": {
    "available": 4,
    "total": 10,
    "fee": 15
  },
  "lastUpdated": "2024-01-15T13:30:00Z",
  "operatingHours": {
    "weekdays": "6:00 AM - 10:00 PM",
    "weekends": "7:00 AM - 11:00 PM"
  }
}
```

**Used in:** `src/pages/client/ParkingInfo.jsx`

---

## 💳 Payment APIs

### 14. Generate Payment QR
**Endpoint:** `POST /api/payment/generate-qr`

**Request Body:**
```json
{
  "token": "ABC123",
  "amount": 60
}
```

**Success Response (200):**
```json
{
  "success": true,
  "qrCodeData": "upi://pay?pa=9862113746@jio&am=60&tn=ParkingFee-ABC123",
  "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "paymentUrl": "upi://pay?pa=9862113746@jio&am=60&tn=ParkingFee-ABC123"
}
```

### 15. Verify Payment
**Endpoint:** `POST /api/payment/verify`

**Request Body:**
```json
{
  "token": "ABC123",
  "transactionId": "TXN123456789",
  "amount": 60
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentStatus": "completed"
}
```

---

## 🔧 Component-wise API Integration

### AuthProvider.jsx
```javascript
// Login API call
const response = await apiClient.post('/auth/login', credentials);
```

### Dashboard.jsx
```javascript
// Get dashboard statistics
const response = await apiClient.get('/dashboard/stats');
```

### ParkingConfig.jsx
```javascript
// Get current configuration
const response = await apiClient.get('/config/parking');

// Update slots
await apiClient.post('/config/parking/slots', parkingSlots);

// Update fees
await apiClient.post('/config/parking/fees', fees);
```

### PaymentSettings.jsx
```javascript
// Get payment settings
const response = await apiClient.get('/config/payment');

// Update payment settings
await apiClient.post('/config/payment', { upiId });
```

### VehicleManager.jsx
```javascript
// Get all vehicles with filters
const response = await apiClient.get('/vehicles', { 
  params: { type: filterType, sort: sortOrder, search: searchTerm } 
});

// Delete vehicle
await apiClient.delete(`/vehicles/${vehicleId}`);
```

### TokenManager.jsx
```javascript
// Search token
const response = await apiClient.get(`/parking/${searchToken}`);

// Exit vehicle
await apiClient.post(`/parking/exit/${tokenData.token}`);
```

### ParkingInfo.jsx
```javascript
// Get parking status
const response = await apiClient.get('/public/parking-status');
```

### TokenLookup.jsx
```javascript
// Lookup token
const response = await apiClient.get(`/parking/${token}`);
```

---

## 🛡️ Security Headers

All authenticated requests should include:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 🚨 Error Handling

Standard error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errorCode": "SPECIFIC_ERROR_CODE",
  "timestamp": "2024-01-15T13:30:00Z"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## 📝 Implementation Notes

1. **Base URL**: Update `src/config/baseurl.js` with your Spring Boot server URL
2. **Authentication**: JWT tokens are stored in localStorage
3. **Error Handling**: All API calls should be wrapped in try-catch blocks
4. **Loading States**: Show loading indicators during API calls
5. **Real-time Updates**: Consider WebSocket integration for real-time parking status updates

---

## 🔄 WebSocket Integration (Optional)

For real-time updates, consider implementing WebSocket endpoints:

**Endpoint:** `ws://localhost:8080/ws/parking-status`

**Message Format:**
```json
{
  "type": "PARKING_UPDATE",
  "data": {
    "vehicleType": "car",
    "action": "entry|exit",
    "availableSlots": 15,
    "timestamp": "2024-01-15T13:30:00Z"
  }
}
```

This comprehensive API documentation provides all the endpoints and data structures needed for your Spring Boot backend implementation.