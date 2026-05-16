# GigFlow — Smart Leads Dashboard

**A modern, full-stack MERN application for managing sales leads with advanced filtering, pagination, and role-based access control.**

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.3-blue)
![React](https://img.shields.io/badge/react-18.2-blue)
![Node.js](https://img.shields.io/badge/node-20+-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [Code Quality](#code-quality)

---

## ✨ Features

### Core Functionality
- ✅ **JWT Authentication** — Secure login/register with bcrypt password hashing
- ✅ **Lead Management** — Full CRUD operations for leads
- ✅ **Advanced Filtering** — Filter by status, source, search name/email
- ✅ **Multi-Sort** — Sort by latest/oldest creation date
- ✅ **Backend Pagination** — 10 records per page with skip/limit
- ✅ **CSV Export** — Download leads with active filters applied
- ✅ **Role-Based Access Control** — Admin and Sales User roles
- ✅ **Dashboard** — Statistics, charts, and recent leads overview

### User Experience
- ✅ **Debounced Search** — 400ms debounce to minimize API calls
- ✅ **Dark Mode** — Toggle dark/light theme (persisted in localStorage)
- ✅ **Responsive Design** — Mobile-first, works on all devices
- ✅ **Loading States** — Spinners and skeletons during data fetch
- ✅ **Empty States** — Helpful messages when no data exists
- ✅ **Error Handling** — Toast notifications for all error scenarios
- ✅ **Form Validation** — Client-side and server-side validation

### Developer Experience
- ✅ **TypeScript** — 100% type-safe, strict mode enabled
- ✅ **Clean Architecture** — Separation of concerns, reusable components
- ✅ **Docker Ready** — Multi-stage builds for production
- ✅ **Git History** — Clean, atomic commits

---

## 🛠 Tech Stack

### Frontend
- **React 18** — UI library
- **TypeScript 5** — Type safety
- **TailwindCSS 3** — Utility-first styling
- **React Router v6** — Client-side routing
- **React Hook Form** — Form state management
- **React Query (@tanstack/react-query)** — Server state management
- **Zustand** — Client state management (auth)
- **Axios** — HTTP client
- **react-hot-toast** — Toast notifications
- **Lucide React** — Icon library
- **Vite** — Build tool

### Backend
- **Node.js 20** — JavaScript runtime
- **Express.js 4** — Web framework
- **TypeScript 5** — Type safety
- **MongoDB** — NoSQL database
- **Mongoose** — ODM
- **JWT (jsonwebtoken)** — Authentication
- **bcryptjs** — Password hashing
- **express-validator** — Input validation
- **Helmet** — Security headers
- **CORS** — Cross-origin resource sharing
- **Morgan** — HTTP request logging

### DevOps
- **Docker** — Containerization
- **Docker Compose** — Multi-container orchestration
- **Nginx** — Reverse proxy & static file serving
- **MongoDB** — Database container

---

## 📁 Project Structure

```
gigflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Auth logic
│   │   │   └── leadController.ts    # Lead CRUD + filters + CSV export
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT verification
│   │   │   ├── errorHandler.ts      # Global error handler
│   │   │   └── validators.ts        # Input validation
│   │   ├── models/
│   │   │   ├── User.ts              # User schema
│   │   │   └── Lead.ts              # Lead schema with indexes
│   │   ├── routes/
│   │   │   ├── authRoutes.ts        # /api/auth endpoints
│   │   │   └── leadRoutes.ts        # /api/leads endpoints
│   │   ├── types/
│   │   │   └── index.ts             # Shared TypeScript types
│   │   ├── utils/
│   │   │   ├── jwt.ts               # JWT token generation/verification
│   │   │   └── response.ts          # Standardized API responses
│   │   └── index.ts                 # Express app & server setup
│   ├── Dockerfile
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.ts             # Axios instance with interceptors
│   │   │   ├── auth.ts              # Auth API calls
│   │   │   └── leads.ts             # Lead API calls + CSV export
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Layout.tsx        # Sidebar, navbar, routing
│   │   │   ├── leads/
│   │   │   │   ├── LeadForm.tsx      # Modal form for create/edit
│   │   │   │   └── FilterBar.tsx     # Status, source, search filters
│   │   │   └── ui/
│   │   │       ├── Badges.tsx        # Status & source badge components
│   │   │       └── Pagination.tsx    # Pagination controls
│   │   ├── hooks/
│   │   │   └── useDebounce.ts        # Debounce hook
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx     # Stats & overview
│   │   │   ├── LeadsPage.tsx         # Table with CRUD
│   │   │   └── LeadDetailPage.tsx    # Single lead detail view
│   │   ├── store/
│   │   │   └── authStore.ts          # Zustand auth store
│   │   ├── types/
│   │   │   └── index.ts              # Frontend types
│   │   ├── App.tsx                   # Router configuration
│   │   ├── main.tsx                  # React entry point
│   │   └── index.css                 # Global styles + Tailwind
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .env.example
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml                # 3-service setup: mongo, backend, frontend
├── .gitignore
├── README.md
└── package.json                      # Root package for concurrently running dev
```

---

## 📋 Prerequisites

### Local Development
- **Node.js** 20+ ([download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **MongoDB** 7+ ([download](https://www.mongodb.com/try/download/community))

### Docker Development
- **Docker** ([install](https://docs.docker.com/get-docker/))
- **Docker Compose** 2.0+ ([install](https://docs.docker.com/compose/install/))

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/gigflow.git
cd gigflow
```

### 2. Install Dependencies
```bash
# Install all dependencies (backend, frontend, root)
npm run install:all
```

Or manually:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Setup Environment Variables

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```bash
cp frontend/.env.example frontend/.env
```
Edit `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running Locally

### Start MongoDB
```bash
# If installed locally
mongod

# Or use Docker
docker run -d -p 27017:27017 --name gigflow-mongo mongo:7
```

### Start Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Demo Credentials
- **Email**: `admin@gigflow.com`
- **Password**: `password123`

---

## 🐳 Running with Docker

### Build and Run
```bash
# Build all images and start services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

### Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **MongoDB**: localhost:27017

### Stop Services
```bash
docker-compose down

# Remove volumes too
docker-compose down -v
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST `/auth/register`
Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "sales"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales"
    }
  }
}
```

#### POST `/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

#### GET `/auth/me`
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User fetched",
  "data": { ... }
}
```

---

### Lead Endpoints

#### GET `/leads`
Get all leads with filters, search, and pagination.

**Query Parameters:**
- `status` — Filter by status (New, Contacted, Qualified, Lost)
- `source` — Filter by source (Website, Instagram, Referral)
- `search` — Search by name or email
- `sort` — Sort by latest or oldest
- `page` — Page number (default: 1)
- `limit` — Records per page (default: 10, max: 100)

**Example:**
```
GET /leads?status=Qualified&source=Website&search=rahul&sort=latest&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Website",
      "notes": "Interested in premium plan",
      "createdBy": { "_id": "...", "name": "Admin" },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### POST `/leads`
Create a new lead.

**Request:**
```json
{
  "name": "Priya Kapoor",
  "email": "priya@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Referred by Rahul"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { ... }
}
```

#### GET `/leads/:id`
Get a single lead by ID.

**Response:**
```json
{
  "success": true,
  "message": "Lead fetched",
  "data": { ... }
}
```

#### PUT `/leads/:id`
Update a lead.

**Request:**
```json
{
  "status": "Contacted",
  "notes": "Call scheduled for next week"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": { ... }
}
```

#### DELETE `/leads/:id`
Delete a lead.

**Response:**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

#### GET `/leads/export/csv`
Export leads as CSV with active filters applied.

**Query Parameters:** Same as GET `/leads`

**Response:** CSV file download

#### GET `/leads/stats`
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "message": "Stats fetched",
  "data": {
    "total": 150,
    "byStatus": {
      "New": 45,
      "Contacted": 38,
      "Qualified": 52,
      "Lost": 15
    },
    "bySource": {
      "Website": 60,
      "Instagram": 55,
      "Referral": 35
    }
  }
}
```

---

## 🔐 Authentication

All protected routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens expire after 7 days. Upon expiration, users are automatically logged out and redirected to login.

---

## 🎯 Role-Based Access Control

### Admin
- View all leads (created by anyone)
- Create, edit, delete any lead
- Access stats and export all leads

### Sales User
- View only their own created leads
- Create, edit, delete their own leads
- Access stats for their leads only
- Cannot edit/delete other users' leads

---

## 🏗 Architecture

### Backend Architecture
```
Request → CORS & Security Headers (Helmet)
       ↓
    Rate Limiting
       ↓
    Request Validation (express-validator)
       ↓
    Authentication Middleware (JWT)
       ↓
    Authorization Middleware (Role check)
       ↓
    Route Handler (Controller)
       ↓
    Database Query (Mongoose)
       ↓
    Error Handler Middleware
       ↓
    Response (standardized format)
```

### Database Schema

**User:**
```typescript
{
  _id: ObjectId,
  name: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (hashed with bcrypt salt 12),
  role: 'admin' | 'sales',
  createdAt: Date,
  updatedAt: Date
}
```

**Lead:**
```typescript
{
  _id: ObjectId,
  name: String (required, 2-100 chars),
  email: String (required, validated),
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost',
  source: 'Website' | 'Instagram' | 'Referral',
  notes: String (max 500 chars, optional),
  createdBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User, optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `status` — for filtering
- `source` — for filtering
- `createdAt` — for sorting
- `name, email` — text index for search
- `createdBy` — for role-based access

---

## 📊 Features in Detail

### Advanced Filtering
All filters work together independently:
```
Status: Qualified + Source: Instagram + Search: "rahul" + Sort: Latest
```

Only leads matching ALL criteria are returned.

### Debounced Search
- 400ms debounce reduces unnecessary API calls
- Real-time search as user types

### CSV Export
- Respects all active filters
- Downloads as `leads-YYYY-MM-DD.csv`
- Includes: name, email, status, source, notes, created by, created at

### Dashboard Stats
- Total leads count
- Breakdown by status (visual bars)
- Breakdown by source (visual bars)
- Recent 5 leads preview

---

## 🧪 Code Quality

### TypeScript
- **Strict Mode** enabled
- All types properly defined
- No `any` usage
- Interfaces for all objects

### Backend Validation
- **Input validation** on all routes (express-validator)
- **MongoDB validation** on schema
- **Custom error messages** for each field
- **Sanitization** of email, trim strings

### Frontend Validation
- **react-hook-form** for client validation
- **Server validation** enforced
- **Error messages** displayed per field

### Error Handling
- **Global error handler** middleware
- **Try-catch** in all async functions
- **Meaningful error messages**
- **Proper HTTP status codes**

### Security
- **JWT tokens** for stateless auth
- **Password hashing** with bcrypt (12 rounds)
- **CORS** configured
- **Helmet** for security headers
- **Rate limiting** on auth endpoints
- **Input sanitization** and validation

### Performance
- **Database indexes** for common queries
- **Pagination** to limit data transfer
- **Debounced search** to reduce API calls
- **Gzip compression** in Nginx
- **Caching** in browser (React Query)

---

## 📝 Git Workflow

### Recommended Commits
```bash
# Initial setup
git commit -m "Initial project setup with MERN stack"

# Features
git commit -m "feat: add JWT authentication"
git commit -m "feat: implement lead CRUD operations"
git commit -m "feat: add advanced filtering with debounced search"
git commit -m "feat: implement pagination with backend skip/limit"
git commit -m "feat: add CSV export functionality"
git commit -m "feat: implement dark mode toggle"

# Styling
git commit -m "style: design dashboard with TailwindCSS"
git commit -m "style: create reusable badge components"

# Testing
git commit -m "test: validate API endpoints"
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running:
```bash
mongod  # or docker run -d -p 27017:27017 mongo:7
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process or change port in `.env`:
```bash
# Mac/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Ensure `FRONTEND_URL` in backend `.env` matches frontend origin:
```
FRONTEND_URL=http://localhost:5173
```

### Docker Issues
```bash
# Rebuild images
docker-compose down
docker-compose up --build

# Remove dangling containers
docker system prune -a
```

---

## 📖 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

## 📄 License

MIT License — feel free to use this project for anything!

---

## 👨‍💻 Author

Created as a Full Stack Internship Assignment at **ServiceHive**

---

**Made with ❤️ using MERN Stack**
