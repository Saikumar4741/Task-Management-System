# Task-Management-System
Full Stack project with  collabration and analytics.
# TaskFlow — Task Management System

![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

A full-stack **Task Management Web Application** where users can create, manage and track their tasks with analytics and insights. Built with React, Node.js, Express and MongoDB.

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **User** | Register, Login, Create/Read/Update/Delete own tasks, View own analytics |
| **Admin** | Everything a User can do + View ALL users' tasks, View all registered users, Delete any task |

> Admin Panel is only visible in the navbar when logged in as an admin.

---

## ✅ Features Implemented

- JWT-based Authentication (Register & Login)
- Full Task CRUD with status tracking (Todo → In Progress → Done)
- Filter tasks by Status and Priority
- Search tasks by Title
- Sort tasks by Due Date or Priority (asc/desc)
- Pagination (6 tasks per page)
- Analytics Dashboard with Pie Chart and Bar Chart
- Dark / Light mode toggle
- Role-based access control (Admin vs User)
- MongoDB indexes for optimized queries
- Global error handling middleware
- Responsive design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, React Router DOM |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcryptjs |

---

## ⚙️ Setup & Installation

### Prerequisites — Install these first
- [Node.js](https://nodejs.org/) v16 or above
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally)
- [Git](https://git-scm.com/)

---

### Step 1 — Clone the Repository
```bash
git clone https://github.com/Saikumar4741/task-manager.git
cd task-manager
```

---

### Step 2 — Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=mysupersecretjwtkey123
```

Start the backend server:
```bash
node server.js

Open Postmon add Admin 
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@gmail.com",
  "password": "admin123",
  "role": "admin"
}
```

✅ Expected output:
```
Server running on port 5000
MongoDB Connected: localhost
```

---

### Step 3 — Frontend Setup
Open a **new terminal** (keep backend running):
```bash
cd frontend
npm install
npm start
```

✅ App opens automatically at: `http://localhost:3000


```

---

## 🎨 Design Decisions

### Backend

**1. JWT Authentication**
Chose JWT over sessions because it is stateless, scales easily, and works well with React frontend. Token is signed with a secret key, expires in 7 days, and is verified on every protected route via the `protect` middleware.

**2. Role-Based Access Control (RBAC)**
User model has a `role` field (`user` or `admin`). Two middleware layers are used: `protect` verifies the JWT token and `adminOnly` checks if the role is admin. Admin routes are completely isolated under `/api/admin`. Regular users hitting admin routes receive a `403 Forbidden` response.

**3. MongoDB Indexing**
Compound indexes added on `{ user, status }`, `{ user, priority }` and `{ user, dueDate }` to speed up filtered queries. A text index on `title` enables fast case-insensitive search. These indexes ensure performance does not degrade as the dataset grows.

**4. Global Error Middleware**
An Express global error handler is registered at the bottom of `server.js`. All controllers use try/catch blocks with meaningful HTTP status codes (400, 401, 403, 404, 500). All errors return a consistent JSON format `{ message, error }` so the frontend can display them cleanly.

**5. Password Security**
Passwords are hashed using bcryptjs with 10 salt rounds before being stored in MongoDB. Plain text passwords are never saved. On login, bcrypt compare is used to verify the entered password against the stored hash.

**6. Pagination**
Backend accepts `page` and `limit` query params, uses Mongoose `skip()` and `limit()` to return only the requested page of results. Response includes `totalPages`, `currentPage` and `total` so the frontend can render pagination controls correctly.

---

### Frontend

**1. React Context for Auth**
`AuthContext` stores the logged-in user and token globally. On page refresh, user data is restored from `localStorage` so the session persists. All components access auth state via the `useAuth()` hook.

**2. Axios Interceptor**
A custom Axios instance automatically reads the JWT token from `localStorage` and attaches it as `Authorization: Bearer TOKEN` on every outgoing request. No need to manually set headers in each API call.

**3. Kanban Board Layout**
Tasks are grouped into three columns — Todo, In Progress, Done — giving a visual overview of progress at a glance. Each column shows a count badge and an empty state message when no tasks exist.

**4. Dark / Light Mode**
A `theme` object holds all color values. Toggling dark mode swaps the theme object and all components re-render with the new colors. Smooth transitions are applied via CSS transition on background and color properties.

**5. Role-Aware Navbar**
The Admin Panel link in the navbar is conditionally rendered only when `user.role === 'admin'`. Regular users never see the link. If an unauthenticated user tries to access `/admin` directly, the `PrivateRoute` component redirects them to `/login`.

**6. Analytics with Recharts**
Recharts Pie chart shows task distribution visually across statuses. Bar chart compares total, done, in progress and todo counts. A progress bar shows overall completion percentage with a smooth fill animation.

---

## 📁 Project Structure

task-manager/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js      # Register & Login logic
│   │   ├── taskController.js      # Task CRUD + Analytics
│   │   └── adminController.js     # Admin operations
│   ├── middleware/
│   │   └── authMiddleware.js      # protect + adminOnly middleware
│   ├── models/
│   │   ├── User.js                # User schema with role field
│   │   └── Task.js                # Task schema with indexes
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth
│   │   ├── taskRoutes.js          # /api/tasks
│   │   └── adminRoutes.js         # /api/admin
│   ├── .env                       # Environment variables
│   └── server.js                  # Express entry point
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js           # Axios instance + interceptor
        ├── components/
        │   ├── Navbar.js          # Navigation with role-aware links
        │   ├── TaskCard.js        # Individual task card
        │   ├── TaskModal.js       # Create / Edit task modal
        │   └── PrivateRoute.js    # Protects routes from unauthenticated access
        ├── context/
        │   └── AuthContext.js     # Global auth state management
        ├── pages/
        │   ├── Login.js           # Login page
        │   ├── Register.js        # Register page
        │   ├── Dashboard.js       # Analytics dashboard
        │   ├── Tasks.js           # Task list with kanban board
        │   └── AdminPanel.js      # Admin: all users and all tasks
        └── App.js                 # Route definitions


---

## 👤 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| User | test@gmail.com | 123456 |
| Admin | admin@gmail.com | 123456 |

---

## 📤 Push to GitHub
```bash
cd task-manager
git init
git add .
git commit -m "TaskFlow - Full Stack Task Management System"
git remote add origin https://github.com/YOUR_USERNAME/task-manager.git
git push -u origin main
```

---

**Built by K Sai Kumar**
