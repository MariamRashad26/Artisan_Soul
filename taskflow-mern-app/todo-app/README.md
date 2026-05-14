# 🚀 Taskflow — Full-Stack MERN Todo App

A production-ready, full-stack task management app built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features JWT authentication, RESTful APIs, dark mode, dashboard analytics, and a modern responsive UI.

---

## ✨ Features

- **🔐 JWT Authentication** — Register/login with secure bcrypt-hashed passwords
- **✅ Task Management** — Create, read, update, delete tasks with full CRUD
- **🎯 Priority Levels** — Low, Medium, High, Urgent with visual indicators
- **📅 Due Dates** — Set due dates with overdue/due-soon alerts
- **🔍 Search & Filter** — Real-time search across title, description, and tags
- **🏷️ Tags & Categories** — Organize tasks with custom tags and categories
- **📊 Dashboard Analytics** — Stats, charts, completion trends, category progress
- **🌙 Dark Mode** — System-aware with manual toggle, persisted to localStorage
- **🛡️ Protected Routes** — Client-side route guards + server-side middleware
- **📱 Responsive UI** — Works on desktop and mobile
- **⚡ Rate Limiting** — API protection with express-rate-limit
- **🔒 Security** — Helmet.js headers, input validation, CORS config

---

## 📁 Project Structure

```
taskflow/
├── package.json              # Root: runs both server & client
│
├── server/                   # Node.js + Express backend
│   ├── index.js              # Entry point
│   ├── .env.example          # Environment variables template
│   ├── config/
│   │   └── db.js             # MongoDB connection (Mongoose)
│   ├── models/
│   │   ├── User.js           # User schema (bcrypt, JWT)
│   │   └── Task.js           # Task schema with indexes
│   ├── controllers/
│   │   ├── authController.js # Register, login, profile
│   │   ├── taskController.js # Full CRUD + filters
│   │   └── dashboardController.js # Stats & aggregations
│   ├── routes/
│   │   ├── auth.js           # /api/auth/*
│   │   ├── tasks.js          # /api/tasks/*
│   │   └── dashboard.js      # /api/dashboard/*
│   └── middleware/
│       └── auth.js           # JWT protect middleware
│
└── client/                   # React.js frontend
    ├── public/index.html
    └── src/
        ├── App.js            # Routes + providers
        ├── index.js          # Entry point
        ├── styles/global.css # All styles + CSS variables + dark mode
        ├── context/
        │   ├── AuthContext.js # Auth state + login/logout/register
        │   └── ThemeContext.js # Dark mode toggle
        ├── hooks/
        │   └── useTasks.js   # Task CRUD hook
        ├── utils/
        │   └── api.js        # Axios instance + interceptors
        ├── components/
        │   ├── Layout.js     # Sidebar + header wrapper
        │   ├── TaskItem.js   # Individual task card
        │   ├── TaskModal.js  # Create/edit modal
        │   └── LoadingSpinner.js
        └── pages/
            ├── Login.js      # Login page
            ├── Register.js   # Registration page
            ├── Dashboard.js  # Stats + charts
            └── Tasks.js      # Task list + filters
```

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router v6, Recharts |
| Styling   | Pure CSS with CSS variables (no framework) |
| Backend   | Node.js, Express.js 4            |
| Database  | MongoDB + Mongoose 8             |
| Auth      | JWT (jsonwebtoken) + bcryptjs    |
| Security  | Helmet, express-rate-limit, express-validator, CORS |
| Dev Tools | Nodemon, Concurrently            |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ (`node -v`)
- MongoDB running locally OR a MongoDB Atlas URI

### 1. Clone & Install

```bash
git clone <your-repo>
cd taskflow

# Install all dependencies (root + server + client)
npm run install-all
```

### 2. Configure Environment Variables

```bash
# Server
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

```bash
# Client
cp client/.env.example client/.env
```

Edit `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

```bash
# Run both frontend and backend simultaneously
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health check**: http://localhost:5000/api/health

---

## 🌐 API Reference

### Auth Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/profile` | ✅ | Update name/preferences |
| PUT | `/api/auth/password` | ✅ | Change password |

### Task Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | ✅ | Get tasks (with filters) |
| POST | `/api/tasks` | ✅ | Create task |
| PUT | `/api/tasks/:id` | ✅ | Update task |
| DELETE | `/api/tasks/:id` | ✅ | Delete task |
| PATCH | `/api/tasks/:id/toggle` | ✅ | Toggle completion |
| DELETE | `/api/tasks/bulk/completed` | ✅ | Delete all completed |
| GET | `/api/tasks/categories` | ✅ | Get user's categories |

#### Task Query Params
```
GET /api/tasks?search=bug&priority=high&completed=false&sortBy=dueDate&order=asc&page=1&limit=20
```

### Dashboard Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/stats` | ✅ | Full dashboard stats |

---

## 🔒 Security Features

- **Passwords** hashed with bcrypt (salt rounds: 12)
- **JWT tokens** expire in 7 days, stored in localStorage
- **Rate limiting** — 100 requests / 15 minutes per IP
- **Helmet.js** — Sets secure HTTP headers
- **Input validation** — express-validator on all inputs
- **MongoDB injection** protection via Mongoose
- **CORS** — Restricted to configured client URL
- **User isolation** — All task queries scoped to `req.user._id`

---

## 🚀 Production Deployment

### Build the React client
```bash
npm run build
```

### Deploy options
- **Frontend**: Vercel, Netlify, or serve from Express as static files
- **Backend**: Railway, Render, Heroku, DigitalOcean
- **Database**: MongoDB Atlas (free tier available)

### Serve client from Express (optional)
Add to `server/index.js`:
```javascript
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}
```

---

## 📦 Key Scripts

| Command | Description |
|---------|-------------|
| `npm run install-all` | Install all dependencies |
| `npm run dev` | Run both servers in dev mode |
| `npm run server` | Run backend only (nodemon) |
| `npm run client` | Run frontend only |
| `npm run build` | Build React for production |

---

## 🧩 Extending the App

Ideas for future features:
- [ ] Google OAuth / Social login
- [ ] Email notifications for due dates
- [ ] Task subtasks / checklists
- [ ] File attachments
- [ ] Team collaboration (shared workspaces)
- [ ] Recurring tasks
- [ ] Kanban board view
- [ ] Export to CSV/PDF
- [ ] Mobile app (React Native)

---

## 📄 License

MIT — free to use, modify, and distribute.
