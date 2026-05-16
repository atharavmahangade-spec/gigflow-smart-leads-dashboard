# GigFlow API Documentation

**Complete API reference for the GigFlow Smart Leads Dashboard backend.**

Base URL: `http://localhost:5000/api`

---

## Table of Contents
1. [Authentication](#authentication)
2. [Leads Management](#leads-management)
3. [Error Handling](#error-handling)
4. [Status Codes](#status-codes)

---

## Authentication

### POST /auth/register
Register a new user account.

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "sales"
}
```

**Request Body:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | 2-50 characters |
| `email` | string | Yes | Valid email, unique |
| `password` | string | Yes | Min 6 characters |
| `role` | string | No | 'admin' or 'sales' (default: 'sales') |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Email already registered",
  "errors": ["Please provide a unique email"]
}
```

---

### POST /auth/login
Authenticate user and receive JWT token.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### GET /auth/me
Get authenticated user profile.

**Request:**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User fetched",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "sales",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

## Leads Management

### GET /leads
Retrieve all leads with filtering, searching, and pagination.

**Request:**
```http
GET /api/leads?status=Qualified&source=Website&search=rahul&sort=latest&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Default | Options |
|-----------|------|---------|---------|
| `status` | string | - | New, Contacted, Qualified, Lost |
| `source` | string | - | Website, Instagram, Referral |
| `search` | string | - | Any name or email substring |
| `sort` | string | latest | latest, oldest |
| `page` | number | 1 | 1+ |
| `limit` | number | 10 | 1-100 |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Website",
      "notes": "Interested in premium plan",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
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

**Note:** Sales users only see leads they created. Admins see all leads.

---

### POST /leads
Create a new lead.

**Request:**
```http
POST /api/leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Priya Kapoor",
  "email": "priya@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Referred by Rahul"
}
```

**Request Body:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | 2-100 characters |
| `email` | string | Yes | Valid email |
| `status` | string | No | New, Contacted, Qualified, Lost (default: New) |
| `source` | string | Yes | Website, Instagram, or Referral |
| `notes` | string | No | Max 500 characters |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Priya Kapoor",
    "email": "priya@example.com",
    "status": "New",
    "source": "Instagram",
    "notes": "Referred by Rahul",
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:35:00Z",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Lead name is required",
    "Please provide a valid email",
    "Invalid source"
  ]
}
```

---

### GET /leads/:id
Retrieve a single lead by ID.

**Request:**
```http
GET /api/leads/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lead fetched",
  "data": { ... }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Lead not found or unauthorized"
}
```

---

### PUT /leads/:id
Update an existing lead.

**Request:**
```http
PUT /api/leads/507f1f77bcf86cd799439012
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Contacted",
  "notes": "Follow-up call scheduled"
}
```

**Request Body:** (all fields optional)
| Field | Type | Constraints |
|-------|------|-------------|
| `name` | string | 2-100 characters |
| `email` | string | Valid email |
| `status` | string | New, Contacted, Qualified, Lost |
| `source` | string | Website, Instagram, Referral |
| `notes` | string | Max 500 characters |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": { ... }
}
```

**Note:** Sales users can only update their own leads.

---

### DELETE /leads/:id
Delete a lead permanently.

**Request:**
```http
DELETE /api/leads/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Lead not found or unauthorized"
}
```

**Note:** Sales users can only delete their own leads. Admins can delete any lead.

---

### GET /leads/stats
Get dashboard statistics.

**Request:**
```http
GET /api/leads/stats
Authorization: Bearer <token>
```

**Success Response (200):**
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

**Note:** Sales users see stats for their leads only. Admins see all stats.

---

### GET /leads/export/csv
Export leads as CSV file with applied filters.

**Request:**
```http
GET /api/leads/export/csv?status=Qualified&source=Website&search=rahul
Authorization: Bearer <token>
```

**Query Parameters:** Same as GET /leads (filters apply)

**Success Response:**
- Content-Type: `text/csv`
- File: `leads.csv`

**CSV Columns:**
```
Name,Email,Status,Source,Notes,Created By,Created At
"Rahul Sharma","rahul@example.com","Qualified","Website","","Admin User","2024-01-15T10:30:00Z"
"Priya Kapoor","priya@example.com","New","Instagram","Referred by Rahul","Admin User","2024-01-15T10:35:00Z"
```

---

## Error Handling

### Error Response Format
All error responses follow this structure:

```json
{
  "success": false,
  "message": "User-friendly error message",
  "errors": ["Specific error 1", "Specific error 2"]
}
```

### Common Errors

| Code | Message | Cause |
|------|---------|-------|
| 400 | Validation failed | Invalid input data |
| 401 | Access denied. No token provided | Missing Authorization header |
| 401 | Invalid or expired token | Token is invalid or expired |
| 403 | Access denied. Insufficient permissions | User role doesn't have permission |
| 404 | Lead not found | Lead ID doesn't exist |
| 409 | Email already registered | Email is already in use |
| 422 | Validation failed | Input validation error with details |
| 500 | Internal Server Error | Server-side error |

---

## Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK — Request succeeded |
| `201` | Created — Resource created successfully |
| `400` | Bad Request — Invalid input |
| `401` | Unauthorized — Authentication required |
| `403` | Forbidden — Insufficient permissions |
| `404` | Not Found — Resource doesn't exist |
| `409` | Conflict — Resource already exists |
| `422` | Unprocessable Entity — Validation failed |
| `500` | Internal Server Error — Server error |

---

## Authentication Details

### JWT Token
- **Algorithm:** HS256
- **Expiration:** 7 days
- **Payload:**
  ```json
  {
    "id": "user_id",
    "name": "user_name",
    "email": "user_email",
    "role": "admin|sales"
  }
  ```

### How to Use Token
1. Receive token from login/register response
2. Store in localStorage: `localStorage.setItem('token', token)`
3. Include in all subsequent requests:
   ```http
   Authorization: Bearer <token>
   ```
4. On token expiration, user is redirected to login

---

## Rate Limiting

- **General API:** 100 requests per 15 minutes
- **Auth Endpoints:** 10 requests per 15 minutes

Response headers include:
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1705324200
```

---

## Filtering Examples

### Filter by Status Only
```
GET /api/leads?status=Qualified
```

### Filter by Source Only
```
GET /api/leads?source=Instagram
```

### Search Only
```
GET /api/leads?search=rahul
```

### All Filters Combined
```
GET /api/leads?status=Qualified&source=Website&search=sharma&sort=latest&page=2&limit=20
```

### Sort Oldest First
```
GET /api/leads?sort=oldest
```

---

## Example Workflow

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "sales"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Create Lead
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya Kapoor",
    "email": "priya@example.com",
    "source": "Instagram"
  }'
```

### 4. Get All Qualified Leads
```bash
curl -X GET "http://localhost:5000/api/leads?status=Qualified" \
  -H "Authorization: Bearer <token>"
```

### 5. Update Lead Status
```bash
curl -X PUT http://localhost:5000/api/leads/<lead_id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Contacted"
  }'
```

### 6. Export Leads as CSV
```bash
curl -X GET "http://localhost:5000/api/leads/export/csv?status=Qualified" \
  -H "Authorization: Bearer <token>" \
  -o leads.csv
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination is 1-indexed (page 1 is the first page)
- Default page size is 10 records
- Maximum page size is 100 records
- Search is case-insensitive
- Multiple filters are combined with AND logic
- Only authenticated users can access lead endpoints
- Sales users can only see/manage their own leads

---

**Last Updated:** January 2024
