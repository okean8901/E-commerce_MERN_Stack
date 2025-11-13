# OkeanMobile_MERN

A MERN + Vite e-commerce starter used for the Okean Mobile project. This repository contains a Node/Express backend and a React + Vite frontend with Tailwind CSS, Redux Toolkit, and Formik/Yup for forms. The project includes admin CRUD pages, product listing, cart & checkout, authentication, and more.

---

## Features

- User auth (register/login)
- Product listing, detail page
- Cart with persistent storage (localStorage)
- Checkout & orders
- Admin CRUD (products, categories, users, orders)
- Tailwind CSS-based responsive UI (Vite)
- Redux Toolkit for state management

---

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React (Vite), Tailwind CSS, React Router, Redux Toolkit
- Forms: Formik + Yup
- Icons: React Icons
- Build: Vite

---

## Repo Structure

- `backend/` - Express server, controllers, routes, models
- `frontend/` - Vite + React app, pages, components, store
- `README.md` - this file
- `SETUP_GUIDE.md` - additional setup notes (if present)

---

## Requirements

- Node.js (>= 18 recommended)
- npm (or pnpm/yarn)
- MongoDB (local or cloud)

---

## Environment Variables

Create a `.env` in `backend/` with at least the following values:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
# Optional: SMTP settings for email service
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
```

And optionally a `.env` in `frontend/` for public variables (e.g., VITE_API_URL):

```
VITE_API_URL=http://localhost:5000/api
```

---

## Backend - Setup & Run

Open a PowerShell terminal and run:

```powershell
cd backend
npm install
# run in dev mode (if a dev script exists)
npm run dev
# or run directly
node server.js
```

If you have a seed script for admin user, run it (check `backend/README.md` or `scripts/`):

```powershell
# example (if provided)
node scripts/seedAdmin.js
```

---

## Frontend - Setup & Run

Open a new PowerShell terminal and run:

```powershell
cd frontend
npm install
npm run dev
# build for production
npm run build
```

The app runs via Vite (default `http://localhost:5173`), and API calls point to the backend (`VITE_API_URL`).

---

## Common Commands

- Start backend (dev): `cd backend; npm run dev` or `node server.js`
- Start frontend (dev): `cd frontend; npm run dev`
- Build frontend for production: `cd frontend; npm run build`
- Run tests (if present): check package.json scripts

---

## Notes & Troubleshooting

- Cart persistence: The frontend saves cart state to `localStorage` and initializes Redux from it. If you see an empty cart after refresh, clear localStorage and try adding items again. The checkout flow sends cart items to backend in the order payload.

- If orders fail with "Giỏ hàng trống":
  - Ensure you're logged in (backend uses authenticated user to clear DB cart if present)
  - Check browser DevTools console for the outgoing order payload (Checkout page logs it)
  - Verify backend `.env` and `MONGO_URI` connection

- CORS / Network: If frontend and backend are on different origins, ensure backend has CORS enabled and `VITE_API_URL` matches the backend.

---

## Contributing

Contributions are welcome. Typical flow:

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-change`
3. Make changes and push
4. Create a pull request with a clear description

Please follow existing code style and patterns (Tailwind utility classes, React + hooks).

---

## License & Acknowledgements

This project is a private / in-house starter. Add a license if you intend to publish it (e.g., MIT).

---

If you'd like, I can:

- Add a `SETUP_GUIDE.md` with screenshots
- Add Dockerfiles for local dev
- Add a CONTRIBUTING.md and CODE_OF_CONDUCT

