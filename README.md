# UTMS – User & Ticket Management System (MVC + TypeORM)

## Features
- JWT auth + OAuth (Google, GitHub, Facebook) via Passport
- CRUD: Users & Tickets; assignment (assignee nullable)
- RBAC (roles & permissions) with Redis caching
- Rate limiting per-IP and per-user (rate-limiter-flexible + Redis)
- DTO validation (class-validator/transformer)
- Production-ready structure, easy to extend

## Stack
Node.js, Express, TypeScript, TypeORM (mysql), Passport, Redis, class-validator

## Setup

1. **Clone & install**
   ```bash
   npm i
   cp .env.example .env
   # Fill DB/OAuth/Redis values




   https://github.com/settings/developers



   https://console.cloud.google.com/apis/credentials


Go to Google Cloud Console

https://console.cloud.google.com/apis/credentials

Create OAuth 2.0 Client ID

Go to Credentials → Create Credentials → OAuth Client ID

Application type: Web application

Add these Authorised redirect URIs:

http://localhost:4000/api/auth/google/callback


Save → Copy Client ID and Client Secret

Add to .env

GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback


Restart your backend server.




Create a GitHub OAuth App

Go to GitHub Developer Settings → OAuth Apps
.

Click New OAuth App.

Fill in:

Application name: Your App Name

Homepage URL: http://localhost:4000 (for local dev)

Authorization callback URL: http://localhost:4000/api/auth/github/callback

After creating, copy Client ID and Client Secret.





# UTMS – User & Ticket Management System (MVC + TypeORM)

A production-ready User & Ticket Management System built with **Node.js, Express, TypeScript, and TypeORM**.  
Includes **JWT + OAuth authentication**, **RBAC with caching**, **rate limiting**, and a clean MVC structure for scalability.

---

## 🚀 Features
- 🔐 **Authentication**
  - JWT authentication
  - OAuth via **Google, GitHub, Facebook** (using Passport)
- 👥 **User Management**
  - CRUD operations
  - Role-based access control (RBAC) with **Redis caching**
- 🎫 **Ticket Management**
  - CRUD operations
  - Ticket assignment (assignee nullable)
- ⚡ **Performance & Security**
  - Per-IP & per-user **rate limiting** (`rate-limiter-flexible` + Redis)
  - DTO validation with `class-validator` & `class-transformer`
- 🛠 **Production Ready**
  - Modular MVC architecture
  - Easy to extend & maintain

---

## 🛠 Tech Stack
- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL + TypeORM
- **Authentication**: Passport (JWT + OAuth providers)
- **Cache / Rate Limit**: Redis
- **Validation**: class-validator, class-transformer

---

## ⚙️ Setup & Installation

### 1. Clone & Install
```bash
git clone https://github.com/your-repo/utms.git
cd utms
npm install
