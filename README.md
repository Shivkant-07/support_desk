# SupportDesk - Full-Stack Support Ticket Management System

**SupportDesk** is a production-grade, multi-role support ticket management web application built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB**.

---

## 🌟 Key Features & Role Matrix

| Capability | User | Agent | Admin |
| :--- | :---: | :---: | :---: |
| **Authentication & Profile** | Register, Login, Update Profile, Change Password | Login, Update Profile, Change Password | Login, Update Profile, Change Password |
| **Dashboard** | Personal counts, recent tickets | Assigned queue counts & activity | System-wide analytics, urgent queue, workloads, charts |
| **Create Ticket** | With category, priority & attachments | ❌ | ❌ |
| **View Tickets** | Own tickets only | Assigned tickets only | All system tickets |
| **Ticket Assignment** | ❌ | ❌ | Assign & reassign tickets to agents |
| **Status Progression** | Close / Reopen resolved tickets | In Progress, Resolved | All statuses (Open, Assigned, In Progress, Resolved, Closed, Reopened) |
| **Priority Override** | ❌ | ❌ | Low, Medium, High, Critical |
| **Conversation Thread** | Add replies & attachments | Add replies & attachments | Add replies & attachments |
| **User Management** | ❌ | ❌ | Full CRUD & Active/Inactive toggle (self-lockout protected) |
| **Agent Management** | ❌ | ❌ | Full CRUD, Workload counters & Active/Inactive toggle |
| **Category Management**| ❌ | ❌ | Create, Edit, Active/Inactive toggle & safe deletion |

---

## 🔄 Ticket Status Lifecycle

```text
User Submits Ticket (Open)
        │
        ▼
Admin Assigns Agent (Assigned)
        │
        ▼
Agent Begins Work / Replies (In Progress)
        │
        ▼
Agent Resolves Issue (Resolved)
        │
   ┌────┴────────────────────────┐
   ▼                             ▼
User Satisfied (Closed)    User Dissatisfied (Reopened)
                                 │
                                 ▼
                         Back to In Progress
```

---

## 🔑 Demo Accounts (Pre-Seeded)

| Role | Email | Password | Department |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@supportdesk.com` | `Admin@123` | IT Administration |
| **Agent (Rahul)** | `agent.rahul@supportdesk.com` | `Agent@123` | Technical Support |
| **Agent (Sarah)** | `agent.sarah@supportdesk.com` | `Agent@123` | Billing & Accounts |
| **User (Aakash)** | `user.aakash@gmail.com` | `User@123` | Engineering |
| **User (Emma)** | `user.emma@company.org` | `User@123` | Marketing |

> *Note: The login page includes a convenient "One-Click Demo Accounts" selector for testing without typing.*

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router DOM v7, Lucide React
- **Backend**: Node.js, Express.js (ES Modules)
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (`jsonwebtoken`), bcryptjs password hashing
- **File Uploads**: Multer (stored in `backend/uploads/` with public static serving)

---

## 🚀 Running the Project

### 1. Backend Server
```bash
cd backend
npm install
npm start          # Runs on http://localhost:5000 (Seeds initial data automatically)
# or for live watch:
npm run dev
```

### 2. Frontend Client
```bash
cd frontend
npm install
npm run dev        # Runs on http://localhost:5173
```

The Vite frontend automatically proxies `/api` and `/uploads` requests to `http://localhost:5000`.

---

## 📡 REST API Summary

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login user/agent/admin
- `GET  /api/auth/me` — Current authenticated user profile
- `PUT  /api/auth/profile` — Update name, phone, department
- `PUT  /api/auth/change-password` — Change password

### Tickets
- `GET    /api/tickets` — List tickets (role scoped & filtered by status/priority/category/search)
- `POST   /api/tickets` — Create ticket with file attachments
- `GET    /api/tickets/:id` — Get ticket details
- `PUT    /api/tickets/:id` — Update ticket status/priority
- `DELETE /api/tickets/:id` — Delete ticket (Admin only)
- `PUT    /api/tickets/:id/assign` — Assign agent (Admin only)
- `PUT    /api/tickets/:id/reopen` — Reopen ticket with reason (User/Admin)
- `PUT    /api/tickets/:id/close` — Close resolved ticket (User/Admin)

### Comments
- `GET    /api/tickets/:id/comments` — Fetch ticket conversation thread
- `POST   /api/tickets/:id/comments` — Post reply with optional attachments

### Management (Admin Only)
- `GET/POST /api/users` & `PUT/DELETE /api/users/:id` — User administration
- `PUT /api/users/:id/status` — Toggle user activation status
- `GET/POST /api/agents` & `PUT /api/agents/:id` — Agent workload management
- `PUT /api/agents/:id/status` — Toggle agent activation status
- `GET/POST /api/categories` & `PUT/DELETE /api/categories/:id` — Category CRUD

### Dashboard
- `GET  /api/dashboard/stats` — Role-based dashboard statistics & chart distributions
