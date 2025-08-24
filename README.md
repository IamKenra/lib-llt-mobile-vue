# LLT Mobile Vue - Mobile Surveyor App

Mobile application untuk surveyor QR scanner dengan Vue 3 + TypeScript.

## 🚀 Features

- **QR Code Scanner** - Real-time scanning dengan camera selection
- **Health Records** - CRUD operations untuk riwayat kesehatan lansia
- **Mobile-First Design** - Touch-friendly responsive UI
- **Authentication** - Session management dengan 8-hour timeout
- **PWA Ready** - Progressive Web App capabilities

## 📱 Routes

- `/login` - Mobile login
- `/scanner` - QR Scanner interface
- `/details` - Detail lansia dengan health records

## 🛠️ Tech Stack

- **Vue 3** + Composition API
- **TypeScript** untuk type safety
- **PrimeVue** UI components
- **Vue Router** untuk navigation
- **Pinia** untuk state management
- **jsQR** untuk QR code scanning
- **Vite** untuk build tools

## 🏗️ Architecture

```
src/
├── views/mobile/          # Mobile-specific views
├── composables/          # Business logic composables
├── services/            # API services & auth
├── styles/             # Mobile-first CSS
└── router/            # Mobile routing configuration
```

## 🚀 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Build

- **Dev Server**: http://localhost:5175/
- **Build Output**: `dist-mobile/`
- **Mobile-Optimized**: Bundle splitting dan lazy loading

## 🔒 Security

- JWT token authentication
- 8-hour session timeout
- Secure localStorage management
- HTTPS-only camera access

## 🎯 Usage

1. **Login** dengan credentials surveyor
2. **Scan QR Code** dari ID lansia
3. **View Details** data lansia
4. **Add Health Records** riwayat kesehatan baru
5. **Logout** untuk keamanan session

## 🔧 Configuration

### Environment Variables
```env
VITE_API_BASE_URL=https://api.llt.local
VITE_APP_NAME="LLT Mobile Surveyor"
```

### Camera Permissions
App memerlukan camera access untuk QR scanning. Browser akan request permission saat pertama kali digunakan.

## 🚦 Status

✅ **Production Ready** - Full implementation dengan testing