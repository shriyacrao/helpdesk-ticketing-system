# IT Help Desk Ticketing System (MERN)

A full-stack ticketing system where users submit IT support tickets, and
agents/admins triage, assign, comment on, and resolve them. 
Built using the MERN stack (MongoDB Atlas, Express.js, React, Node.js) with JWT authentication. The application is deployed on Render (backend) and Vercel (frontend).

## Live Demo
https://helpdesk-ticketing-system-orcin.vercel.app

## GitHub Repository
https://github.com/shriyacrao/helpdesk-ticketing-system

## Features

- JWT authentication (register/login) with 3 roles: `user`, `agent`, `admin`
- Users: create tickets, view/comment on their own tickets
- Agents/Admins: view all tickets, change status/priority, assign tickets, comment
- Admins: manage user roles
- Dashboard with charts (tickets by status/category) using Recharts
- Filtering tickets by status/category/priority
- Comment threads per ticket

## Tech Stack

- **Frontend:** React 18, React Router, Axios, Recharts, plain CSS
- **Backend:** Node.js, Express, Mongoose (MongoDB), JSON Web Tokens, bcryptjs

## Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

## Project Structure

```
helpdesk-ticketing-system/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # User.js, Ticket.js (Mongoose schemas)
│   ├── middleware/                # auth.js (JWT verify), roleCheck.js
│   ├── controllers/               # authController, ticketController, userController
│   ├── routes/                    # authRoutes, ticketRoutes, userRoutes
│   ├── server.js                  # Express app entry point
│   ├── seed.js                    # Creates demo admin/agent/user accounts
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── api/axios.js           # Axios instance with JWT interceptor
    │   ├── context/AuthContext.js # Auth state (login/register/logout)
    │   ├── components/            # Navbar, PrivateRoute, TicketCard
    │   ├── pages/                 # Login, Register, Dashboard, Tickets,
    │   │                          # TicketDetail, CreateTicket, AdminUsers
    │   ├── App.js                 # Routes
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── .env.example
```

## Prerequisites

- Node.js v18+ and npm
- MongoDB running locally (`mongod`) OR a free MongoDB Atlas cluster (get a connection string)

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set:
- `MONGO_URI` — your local Mongo URI or Atlas connection string
- `JWT_SECRET` — any long random string

Start MongoDB locally if using a local DB:
```bash
mongod
```

(Optional but recommended) Seed 3 demo accounts — admin, agent, user, all with password `password123`:
```bash
npm run seed
```

Start the backend API (default port 5000):
```bash
npm run dev
```
You should see: `MongoDB connected...` and `Server running on port 5000`.

### 2. Frontend

Open a **new terminal**:
```bash
cd frontend
npm install
cp .env.example .env
```
The default `.env` points to `http://localhost:5000/api` — leave as is if backend runs on 5000.

Start the React app (default port 3000):
```bash
npm start
```

Your browser should open `http://localhost:3000`.

### 3. Log in

Register a new account to start using the application.

## API Overview

| Method | Endpoint                     | Access          | Description               |
|--------|-------------------------------|-----------------|----------------------------|
| POST   | /api/auth/register            | Public          | Create account (role=user) |
| POST   | /api/auth/login               | Public          | Log in, get JWT            |
| GET    | /api/auth/me                  | Logged in       | Get current user           |
| GET    | /api/tickets                  | Logged in       | List tickets (own or all)  |
| POST   | /api/tickets                  | Logged in       | Create a ticket            |
| GET    | /api/tickets/:id              | Logged in       | Ticket details             |
| PUT    | /api/tickets/:id              | Owner/staff     | Update a ticket            |
| DELETE | /api/tickets/:id              | Owner/admin     | Delete a ticket            |
| POST   | /api/tickets/:id/comments     | Owner/staff     | Add a comment              |
| GET    | /api/tickets/stats/summary    | Logged in       | Dashboard stats            |
| GET    | /api/users                    | Admin           | List all users             |
| GET    | /api/users/agents             | Admin/Agent     | List agents (for assignment)|
| PUT    | /api/users/:id/role           | Admin           | Change a user's role       |

## Notes

- This is a learning/demo project — for production you'd add things like
  rate limiting, email notifications, password reset, refresh tokens, and
  input validation libraries (e.g. `express-validator` or `zod`).
