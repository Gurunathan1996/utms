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
