<div align="center">

  <img src="./assets/logo.png" alt="Refined Portfolio Logo" width="120" />

# Refined Portfolio — Backend

A production-ready REST API built with **NestJS**, featuring authentication, caching, background jobs, and structured logging.

[![Backend](https://img.shields.io/badge/Backend-NestJS-E0234E?logo=nestjs)](https://nestjs.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)](https://postgresql.org)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://prisma.io)
[![Cache](https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis)](https://redis.io)
[![Queue](https://img.shields.io/badge/Queue-BullMQ-FF6B6B)](https://docs.bullmq.io)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

[API Docs](#api-docs) ·
[Report Bug](https://github.com/Mahardika-Ardi/Refined-Portfolio/issues) ·
[Request Feature](https://github.com/Mahardika-Ardi/Refined-Portfolio/issues)

</div>

---

## 📸 Preview

> Screenshots of API response, Swagger UI, or terminal logs.

<div align="center">

### API Response

  <img src="./assets/preview-create-user.png" alt="API Response" width="700" />

  <img src="./assets/preview-create-user.png" alt="API Response" width="700" />

### Winston Logger Output

  <img src="./assets/preview-logger.png" alt="Logger Output" width="700" />

### Swagger Documentation

  <img src="./assets/preview-swagger.png" alt="Swagger UI" width="700" />

### Redis Cache & Queue

  <img src="./assets/preview-redis.png" alt="Redis" width="700" />

</div>

---

## 📌 About

**Refined Portfolio Backend** is a NestJS REST API that demonstrates production-ready backend patterns including:

- JWT authentication with cookie-based token storage
- Redis blacklist for token revocation on logout
- Background job processing with BullMQ
- Redis caching with automatic invalidation
- Rate limiting per endpoint
- Structured logging with Winston
- OTP flow for email verification and password reset
- Avatar upload with Cloudinary
- Global exception handling

---

## 🧱 Tech Stack

| Category      | Technology          |
| ------------- | ------------------- |
| Framework     | NestJS              |
| Language      | TypeScript          |
| Database      | PostgreSQL          |
| ORM           | Prisma              |
| Cache & Queue | Redis + BullMQ      |
| Auth          | JWT + Passport      |
| Logger        | Winston             |
| File Upload   | Cloudinary + Multer |
| Mail          | Nodemailer          |
| Testing       | Jest                |

---

## 📁 Project Structure

```bash
backend/
├── src/
│   ├── auth/                  # Register, login, logout, OTP
│   ├── users/                 # User management (CRUD, avatar)
│   ├── health/                # Health check endpoint
│   ├── common/
│   │   ├── blacklist/         # JWT blacklist (Redis)
│   │   ├── cache/             # Cache service wrapper
│   │   ├── cloudinary/        # Cloudinary queue & processor
│   │   ├── config/            # Cloudinary & Multer config
│   │   ├── constants/         # Queue keys & cache keys
│   │   ├── decorators/        # CurrentUser, Public, Role
│   │   ├── filters/           # Global exception filter
│   │   ├── guards/            # JWT, Roles, Throttler guards
│   │   ├── hash/              # Bcrypt hashing service
│   │   ├── interceptors/      # Response interceptor
│   │   ├── logger/            # Winston logger
│   │   ├── mail/              # Mail service + BullMQ processor
│   │   ├── middleware/        # HTTP logger middleware
│   │   ├── otp/               # OTP generate & verify
│   │   ├── prisma/            # Prisma service
│   │   ├── redis/             # Redis module
│   │   └── utils/             # AppError, Prisma error utils
│   ├── app.module.ts
│   └── main.ts
├── test/                      # E2E & unit test mocks
├── prisma/                    # Prisma schema & migrations
├── logs/                      # Winston log files (auto-created)
├── .env.example
├── docker-compose.yml
└── package.json
```

---

## 🚀 Quick Start

### 1. Clone repository

```bash
git clone https://github.com/your-username/Refined-Portfolio.git
cd Refined-Portfolio/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
# Edit .env according to your configuration
```

### 4. Start Redis with Docker

```bash
docker compose up -d
```

### 5. Run Prisma migration

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Start development server

```bash
npm run start:dev
```

API runs at `http://localhost:4000`

---

## ⚙️ Environment Variables

```env
# App
APP_NAME=portofolio-backend
NODE_ENV=development
LOG_LEVEL=debug
PORT=3000

# Database
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DB_NAME

# JWT
SECRET_KEY=your_jwt_secret_here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Cloudinary
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Mail
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
```

---

## 🔐 Authentication Flow

```
Register → Login → JWT stored in HttpOnly Cookie
→ Every request automatically sends the cookie
→ Logout → token added to Redis blacklist → cookie cleared
→ Blacklisted tokens can no longer be used
```

---

## 📮 API Endpoints

### Auth

| Method | Endpoint                        | Description                     | Auth |
| ------ | ------------------------------- | ------------------------------- | ---- |
| POST   | `/auth/register`                | Register a new user             | ❌   |
| POST   | `/auth/login`                   | Login & set cookie              | ❌   |
| POST   | `/auth/logout`                  | Logout & blacklist token        | ✅   |
| POST   | `/auth/forgot-password`         | Send OTP for password reset     | ✅   |
| POST   | `/auth/reset-password`          | Reset password using OTP        | ✅   |
| POST   | `/auth/send-verification-email` | Send OTP for email verification | ✅   |
| POST   | `/auth/verify-email`            | Verify email using OTP          | ✅   |
| POST   | `/auth/refresh-otp`             | Refresh OTP                     | ✅   |

### Users

| Method | Endpoint         | Description             | Auth     |
| ------ | ---------------- | ----------------------- | -------- |
| GET    | `/users/findall` | Get all users (admin)   | ✅ Admin |
| GET    | `/users/me`      | Get own profile         | ✅       |
| PATCH  | `/users/me`      | Update profile + avatar | ✅       |
| DELETE | `/users/me`      | Delete account          | ✅       |

### Health

| Method | Endpoint  | Description           |
| ------ | --------- | --------------------- |
| GET    | `/health` | Check database status |

---

## 📬 Postman Collection

Import this collection into Postman to try all endpoints directly.

<div align="center">

[![Run in Postman](https://run.pstmn.io/button.svg)](https://web.postman.co/workspace/My-Workspace~37a96f9a-70f8-4951-8e4c-b9ed9dcd9ef2/collection/36964252-21115b17-2d26-4b5d-be29-8e9bb1597ce0?action=share&source=copy-link&creator=36964252)

</div>

Or download manually: [Refined-Portfolio.postman_collection.json](./docs/Portofolio.postman_collection.json)

---

## ✅ Scripts

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e
npm run test:cov

# Prisma
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

---

## 🗺️ Roadmap

- [x] JWT Authentication with cookie
- [x] Redis blacklist for logout
- [x] Rate limiting per endpoint
- [x] Redis caching with auto invalidation
- [x] BullMQ queue for email & Cloudinary
- [x] Winston structured logging
- [x] OTP flow (reset password & email verification)
- [x] Global exception filter
- [x] Unit & E2E testing
- [x] Swagger API documentation
- [x] CI/CD pipeline
- [x] Deployment

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  Built with 🔥 for learning and growth.
</div>
