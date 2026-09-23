# User CRUD App

A minimal full-stack app with JWT cookie authentication and user CRUD, built with:

- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** NestJS + Mongoose (MongoDB)
- **Auth:** JWT stored in an HTTP-only cookie

## Project structure

```
user-crud-app/
├── backend/    # NestJS API (auth + users modules)
└── frontend/   # Next.js app (register, login, dashboard)
```

## Features

- Register (name, email, password — hashed with bcrypt)
- Login (issues a JWT set as an HTTP-only cookie)
- Logout (clears the cookie)
- Route protection: NestJS `JwtAuthGuard` on the API, Next.js `middleware.ts` on the frontend
- View all users, view one user, update your own profile, delete your own account
- DTO validation with `class-validator`

## 1. Local setup

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local `mongodb://localhost:27017/user-crud-app` or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# fill in MONGO_URI and JWT_SECRET in .env
npm run start:dev
```

Runs on `http://localhost:4000` by default.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev
```

Runs on `http://localhost:3000`. Visit `/register` to create an account, then `/dashboard`.

## 2. Environment variables

**backend/.env**
```
PORT=4000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/user-crud-app
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## 3. Deployment

### Backend → Render

1. Push this repo to GitHub.
2. In Render, create a new **Web Service**, point it at the `backend/` directory (Root Directory: `backend`).
3. Build command: `npm install && npm run build`
4. Start command: `npm run start:prod`
5. Add the environment variables from `backend/.env.example` in Render's dashboard, using:
   - `MONGO_URI` → your Atlas connection string
   - `JWT_SECRET` → a long random string
   - `FRONTEND_URL` → your Vercel URL (set this **after** step below, then redeploy)
   - `NODE_ENV=production`
6. Deploy. Note the Render URL, e.g. `https://your-app.onrender.com`.

### Frontend → Vercel

1. In Vercel, import the same repo with **Root Directory** set to `frontend`.
2. Add environment variable `NEXT_PUBLIC_API_URL` = your Render backend URL.
3. Deploy. Note the Vercel URL, e.g. `https://your-app.vercel.app`.
4. Go back to Render and set `FRONTEND_URL` to this Vercel URL, then redeploy the backend (needed for CORS to allow the exact origin).

### Cross-domain cookies — why it works

- Cookie is set with `httpOnly: true`, `secure: true`, `sameSite: 'none'` in production, which is required for a cookie to be sent from a Vercel domain to a different Render domain over HTTPS.
- CORS on the backend is configured with `origin: process.env.FRONTEND_URL` and `credentials: true` — an exact origin match is required when sending credentials (wildcard `*` will not work with cookies).
- The frontend's `fetch` calls all use `credentials: 'include'` (see `frontend/lib/api.ts`) so the browser attaches/accepts the cookie.

### Verifying the live flow

Once both are deployed: visit the Vercel URL → `/register` → creates an account and logs in → redirects to `/dashboard` → shows the user list and your profile → try editing your profile and deleting the account → confirm `/logout` clears the session and redirects unauthenticated visits to `/dashboard` back to `/login`.

## 4. API summary

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create a user |
| POST | `/auth/login` | — | Log in, sets cookie |
| POST | `/auth/logout` | — | Clears cookie |
| GET | `/auth/me` | ✔ | Current user |
| GET | `/users` | ✔ | List all users |
| GET | `/users/:id` | ✔ | Get one user |
| PATCH | `/users/me` | ✔ | Update own profile |
| DELETE | `/users/me` | ✔ | Delete own account |

## Notes

- No roles/permissions — every authenticated user can view the full user list, but can only update/delete their own record (enforced server-side using the JWT payload, not a client-supplied ID).
- Passwords are hashed with bcrypt (10 salt rounds) and never returned in API responses.
