# LoopAffi Backend

Backend API untuk sistem informasi komisi afiliasi LoopAffi.

## Stack Teknologi
- **Bahasa**: Go 1.23+
- **Framework**: Gin
- **Database**: PostgreSQL
- **Auth**: JWT (golang-jwt/v5)
- **ORM/Query**: sqlx

## Struktur Folder
```
loopaffi-backend/
├── cmd/server/main.go          # Entry point
├── internal/
│   ├── config/                 # Load .env
│   ├── database/               # Koneksi PostgreSQL
│   ├── routes/                 # Routing semua endpoint
│   ├── middleware/             # Auth JWT & Role middleware
│   ├── handler/                # HTTP handler (Controller)
│   ├── service/                # Business logic
│   ├── repository/             # Query database
│   ├── entity/                 # Struct tabel database
│   ├── dto/                    # Request & Response struct
│   ├── response/               # Standard JSON response helper
│   └── utils/                  # JWT & bcrypt utilities
├── migrations/                 # File .sql migration
├── .env                        # Konfigurasi environment
└── go.mod
```

## Setup & Menjalankan

### 1. Pastikan PostgreSQL berjalan
```bash
# Buat database
psql -U postgres -c "CREATE DATABASE loopaffi;"
```

### 2. Jalankan migration
```bash
psql -U postgres -d loopaffi -f migrations/001_create_users.up.sql
```

### 3. Sesuaikan .env
```env
APP_PORT=8080
JWT_SECRET=loopaffi-secret-key-change-in-production
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=loopaffi
DB_SSLMODE=disable
```

### 4. Jalankan server
```bash
go run cmd/server/main.go
```

Server akan berjalan di: `http://localhost:8080`

---

## Endpoint Phase 1 — Auth

### Health Check
```
GET /health
```
Response:
```json
{ "status": "ok", "app": "LoopAffi Backend" }
```

---

### Login
```
POST /api/v1/auth/login
Content-Type: application/json
```
Request:
```json
{
  "email": "admin@loopaffi.com",
  "password": "password123"
}
```
Response sukses (200):
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "a0000000-...",
      "name": "Admin User",
      "email": "admin@loopaffi.com",
      "role": "admin"
    }
  }
}
```
Response gagal (401):
```json
{
  "status": "error",
  "message": "email atau password salah",
  "data": null
}
```

---

### Register (Affiliator)
```
POST /api/v1/auth/register
Content-Type: application/json
```
Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "whatsapp": "081234567890",
  "password": "password123"
}
```
Response sukses (201):
```json
{
  "status": "success",
  "message": "Registrasi berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "affiliate"
    }
  }
}
```
Response konflik email (409):
```json
{
  "status": "error",
  "message": "email sudah terdaftar",
  "data": null
}
```

---

### Test Admin-only Endpoint (dengan token)
```
GET /api/v1/admin/ping
Authorization: Bearer <token>
```

### Test Affiliate-only Endpoint (dengan token)
```
GET /api/v1/affiliate/ping
Authorization: Bearer <token>
```

---

## Progress Implementasi
- [x] Phase 1: Auth (Login, Register, Middleware JWT + Role)
- [ ] Phase 2: Sales & Products
- [ ] Phase 3: Commission & Payments
- [ ] Phase 4: Reporting & Dashboard
