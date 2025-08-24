# 🔧 Setup Proxy untuk Mengatasi CORS

## 🎯 Konsep Penting

### ❌ **Yang SALAH (akan kena CORS)**
```bash
VITE_API_BASE_URL=http://localhost:3000/llt-svc  # Direct call, kena CORS!
```

### ✅ **Yang BENAR (menggunakan proxy)**
```bash
VITE_API_BASE_URL=/llt-svc                      # Relative path, akan di-proxy
VITE_BACKEND_TARGET=http://localhost:3000       # Target untuk proxy
```

## 🔄 Alur Kerja Proxy

```
Frontend Request:
POST /llt-svc/auth/login
    ↓
Vite Dev Server (localhost:5175):
"Oh ini /llt-svc, saya proxy ke backend"
    ↓
Backend (localhost:3000):
POST http://localhost:3000/llt-svc/auth/login
    ↓
Response kembali melalui proxy
    ↓
Frontend menerima response (no CORS!)
```

## ⚙️ Konfigurasi File

### 1. `.env`
```bash
# API Base URL - HARUS relative path untuk development
VITE_API_BASE_URL=/llt-svc

# Backend target - untuk proxy configuration
VITE_BACKEND_TARGET=http://localhost:3000

# Untuk production/staging, ganti ke full URL:
# VITE_API_BASE_URL=https://api.yourdomain.com/llt-svc
```

### 2. `vite.config.js`
```javascript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.VITE_BACKEND_TARGET || 'http://localhost:3000'
  
  return {
    server: {
      port: 5175,
      proxy: {
        '/llt-svc': {
          target: backendTarget,       // Dari VITE_BACKEND_TARGET
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
```

## 🚀 Cara Test

### 1. Restart Development Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 2. Cek Console Output
Anda harus melihat:
```
🔧 Vite Config:
   API Base URL: /llt-svc
   Backend Target: http://localhost:3000
   Proxy will redirect /llt-svc/* to http://localhost:3000
```

### 3. Test Login
- Buka Network tab di browser
- Coba login
- Request seharusnya muncul sebagai: `POST http://localhost:5175/llt-svc/auth/login`
- Status: `200 OK` (bukan CORS error)

## 🐛 Troubleshooting

### Jika masih CORS error:
1. **Pastikan `.env` menggunakan relative path:**
   ```bash
   VITE_API_BASE_URL=/llt-svc  ✅
   # BUKAN: VITE_API_BASE_URL=http://localhost:3000/llt-svc  ❌
   ```

2. **Pastikan backend berjalan di port yang benar:**
   ```bash
   VITE_BACKEND_TARGET=http://localhost:3000  # Sesuaikan port backend
   ```

3. **Clear cache dan restart:**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

## 🌟 Multi-Environment Setup

### Development
```bash
VITE_API_BASE_URL=/llt-svc
VITE_BACKEND_TARGET=http://localhost:3000
```

### Production Build
```bash
VITE_API_BASE_URL=https://api.yourdomain.com/llt-svc
# VITE_BACKEND_TARGET tidak digunakan di production
```

### Tim dengan Port Berbeda
```bash
# Developer A
VITE_BACKEND_TARGET=http://localhost:3000

# Developer B  
VITE_BACKEND_TARGET=http://localhost:8000

# Developer C (Docker)
VITE_BACKEND_TARGET=http://localhost:3001
```