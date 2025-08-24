# 🔧 Solusi CORS Error dengan Fleksibilitas Development

## ❌ Masalah
Error "strict-origin-when-cross-origin" terjadi karena:
- Frontend: `http://localhost:5175`
- Backend: `http://localhost:3000` (atau port lain)
- Browser memblokir cross-origin requests

## ✅ Solusi: Dynamic Vite Proxy

### 1. Konfigurasi Dynamic Proxy di `vite.config.js`
```javascript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:3000/llt-svc'
  
  // Extract target URL for proxy
  const apiUrl = new URL(apiBaseUrl)
  const proxyTarget = `${apiUrl.protocol}//${apiUrl.host}`
  
  return {
    server: {
      proxy: {
        '/llt-svc': {
          target: proxyTarget,  // Dynamic berdasarkan .env
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
```

### 2. Flexible `.env` Configuration
```bash
# Default Development
VITE_API_BASE_URL=http://localhost:3000/llt-svc

# Alternative Ports (uncomment as needed)
# VITE_API_BASE_URL=http://localhost:3001/llt-svc
# VITE_API_BASE_URL=http://localhost:8000/llt-svc

# Staging Environment
# VITE_API_BASE_URL=https://api-staging.yourdomain.com/llt-svc

# Production
# VITE_API_BASE_URL=https://api.yourdomain.com/llt-svc
```

## 🔄 Bagaimana Proxy Bekerja

1. **Frontend Request**: `POST /llt-svc/auth/login`
2. **Vite Proxy**: Membaca `VITE_API_BASE_URL` dan meneruskan ke target dinamis
3. **Backend Response**: Dikembalikan melalui proxy
4. **No CORS Error**: Karena request tampak dari origin yang sama

## 💡 Keuntungan Solusi Ini

### ✅ **Fleksibilitas Development**
- Ganti port backend dengan mudah di `.env`
- Support multiple environments (dev, staging, prod)
- Team bisa menggunakan port berbeda tanpa konflik

### ✅ **Easy Environment Switching**
```bash
# Developer A menggunakan port 3000
VITE_API_BASE_URL=http://localhost:3000/llt-svc

# Developer B menggunakan port 8000  
VITE_API_BASE_URL=http://localhost:8000/llt-svc

# Staging testing
VITE_API_BASE_URL=https://api-staging.company.com/llt-svc
```

## 🚀 Cara Restart Development Server

Setelah perubahan `.env`:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

Anda akan melihat di console:
```
🔧 Vite Config:
   API Base URL: http://localhost:3000/llt-svc
   Proxy Target: http://localhost:3000
```

## 🐛 Debugging

Console akan menampilkan:
- `🚀 Proxying: POST /llt-svc/auth/login`
- `✅ Proxy response: 200 /llt-svc/auth/login`

## 🌟 Best Practices

### Development
```bash
VITE_API_BASE_URL=http://localhost:3000/llt-svc
```

### Staging
```bash
VITE_API_BASE_URL=https://api-staging.yourdomain.com/llt-svc
```

### Production Build
```bash
VITE_API_BASE_URL=https://api.yourdomain.com/llt-svc
```

## 📝 Production Setup

Untuk production, pastikan backend mengizinkan CORS dari domain frontend:
```javascript
// Express.js example
app.use(cors({
  origin: [
    'http://localhost:5175',  // Development
    'https://yourdomain.com'  // Production
  ],
  credentials: true
}));
```