# 🔧 CORS Backend Configuration

## ❌ CORS Error yang Terjadi
Ketika frontend `http://localhost:5175` memanggil backend `http://localhost:3000`, browser memblokir request karena different origin (CORS policy).

## ✅ Solusi: Backend CORS Configuration

### 1. Express.js Backend Setup
Pastikan backend Anda mengizinkan CORS dari frontend:

```javascript
const cors = require('cors');
const express = require('express');
const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5175',  // Frontend development
    'http://127.0.0.1:5175',  // Alternative localhost
    'http://localhost:3000',  // Same origin (optional)
  ],
  credentials: true,  // Allow cookies/auth headers
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ]
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
```

### 2. Alternative: Permissive CORS (Development Only)
```javascript
// WARNING: Only for development!
app.use(cors({
  origin: true,
  credentials: true
}));
```

### 3. Manual CORS Headers (if no CORS middleware)
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5175');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

## 🔄 Frontend Configuration (Already Done)

Frontend sudah dikonfigurasi dengan:
- Direct backend URL: `${VITE_BACKEND_TARGET}/llt-svc`
- Proper headers: `Content-Type` dan `Accept`
- No credentials: `withCredentials: false`
- Timeout: 10 seconds

## 🧪 Testing CORS

### 1. Check Network Tab
Browser DevTools → Network → lihat request headers:
```
Origin: http://localhost:5175
Content-Type: application/json
Accept: application/json
```

### 2. Check Backend Response Headers
Response harus memiliki:
```
Access-Control-Allow-Origin: http://localhost:5175
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Origin,X-Requested-With,Content-Type,Accept,Authorization
```

### 3. Preflight Request (OPTIONS)
Untuk POST/PUT requests, browser akan kirim OPTIONS request terlebih dahulu.

## 🚀 Production Considerations

### Frontend Production Domain
```javascript
// Backend CORS config for production
const corsOptions = {
  origin: [
    'http://localhost:5175',  // Development
    'https://yourdomain.com',  // Production
    'https://www.yourdomain.com'  // Production with www
  ],
  credentials: true
};
```

### Environment-based CORS
```javascript
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://yourdomain.com', 'https://www.yourdomain.com']
  : ['http://localhost:5175', 'http://127.0.0.1:5175'];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true
};
```

## 🐛 Common CORS Issues

### Issue 1: Preflight Failed
**Problem**: OPTIONS request failed
**Solution**: Ensure backend handles OPTIONS method

### Issue 2: Credentials Block
**Problem**: Request blocked when sending cookies
**Solution**: Set `credentials: true` in both frontend and backend

### Issue 3: Wrong Origin
**Problem**: CORS error with specific domain
**Solution**: Check exact frontend URL (with/without trailing slash)

## 📝 Backend Checklist

- [ ] Install CORS middleware (`npm install cors`)
- [ ] Configure allowed origins (include `http://localhost:5175`)
- [ ] Enable credentials if needed
- [ ] Handle OPTIONS preflight requests
- [ ] Test with browser DevTools Network tab