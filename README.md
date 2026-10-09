# Freelance Flow

Freelance Flow is a full-stack workspace for independent professionals to manage clients, projects, payments, and income from one dashboard.

The application provides authenticated CRUD workflows for client, project, and payment records, along with dashboard summaries and financial visualizations.

## Features

- User registration and JWT-based authentication
- Protected dashboard and account profile management
- Client management with create, view, update, and delete actions
- Project management with status tracking and client relationships
- Payment tracking with status filtering and project relationships
- Dashboard metrics for active projects, clients, total income, and pending payments
- Monthly income and project-status charts
- Payment CSV export
- Responsive React interface with toast notifications

## Tech Stack

### Frontend

- React
- React Router
- Vite
- Axios
- Recharts
- Lucide React
- React Hot Toast

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens
- bcryptjs
- CORS

## Prerequisites

Install the following before setting up the project:

- Node.js and npm
- A MongoDB database, either a local MongoDB server or a MongoDB Atlas cluster

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ChamalshaInduwara/freelance-flow.git
cd freelance-flow
```

### 2. Configure the backend

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/freelance-flow
JWT_SECRET=replace-with-a-long-random-secret
```

For MongoDB Atlas, use the connection string provided by your cluster as `MONGODB_URI`. Keep this file private; it is ignored by Git.

Install backend dependencies and start the API:

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default. The root endpoint can be used as a basic health check:

```text
GET http://localhost:5000/
```

### 3. Configure and start the frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

The frontend currently connects to the API at `http://localhost:5000/api`. If the backend is hosted elsewhere, update the API base URL in `frontend/src/services/api.js` before building the frontend.

## Available Scripts

### Backend

Run these commands from `backend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node.js |

### Frontend

Run these commands from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Application Routes

### Frontend pages

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Sign in to an account |
| `/register` | Public | Create an account |
| `/dashboard` | Authenticated | View financial and project summaries |
| `/clients` | Authenticated | Manage clients |
| `/projects` | Authenticated | Manage projects |
| `/payments` | Authenticated | Manage and export payments |
| `/profile` | Authenticated | Manage profile details and password |

### API resources

All resource routes are prefixed with `/api` and require a bearer token unless noted otherwise.

| Endpoint | Methods | Purpose |
| --- | --- | --- |
| `/api/auth/register` | `POST` | Register a user |
| `/api/auth/login` | `POST` | Authenticate a user |
| `/api/auth/me` | `GET` | Get the authenticated user |
| `/api/auth/profile` | `PUT` | Update profile details |
| `/api/auth/password` | `PUT` | Update the account password |
| `/api/clients` | `GET`, `POST` | List or create clients |
| `/api/clients/:id` | `GET`, `PUT`, `DELETE` | Read, update, or delete a client |
| `/api/projects` | `GET`, `POST` | List or create projects |
| `/api/projects/:id` | `GET`, `PUT`, `DELETE` | Read, update, or delete a project |
| `/api/payments` | `GET`, `POST` | List or create payments |
| `/api/payments/:id` | `GET`, `PUT`, `DELETE` | Read, update, or delete a payment |
| `/api/dashboard/summary` | `GET` | Get dashboard metrics and chart data |

## Project Structure

```text
freelance-flow/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API route definitions
│   └── server.js        # Express application entry point
└── frontend/
    ├── src/components/  # Shared UI components
    ├── src/context/     # Authentication state
    ├── src/layouts/     # Authenticated and public layouts
    ├── src/pages/       # Application screens
    ├── src/services/    # API client
    └── src/App.jsx      # Frontend route configuration
```

## Security Notes

- Do not commit `backend/.env` or any other secret-bearing environment file.
- Use a strong, unique value for `JWT_SECRET` in every deployed environment.
- Use a restricted MongoDB user and network policy for production databases.
- Replace the development CORS configuration and hard-coded local API URL before production deployment.

## Current Status

Freelance Flow is an active development project. The core authentication, client, project, payment, profile, and dashboard workflows are implemented.

## License

No open-source license has been declared yet.
