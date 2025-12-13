# CSE327 Movie Ticket Management

This repository implements a Movie Ticket Management web application with a React/Vite frontend and a Node/Express backend. It provides user-facing pages for browsing movies, booking seats, viewing bookings, admin pages for listing/adding shows, and integrations such as Stripe (for payments) and email notifications.

This README summarizes what was implemented, how to run the app locally, and pointers to important files.

## What this project contains
- **Client**: React + Vite app in the `client/` folder. Components, pages, and an admin UI are included.
- **Server**: Node.js + Express API in the `server/` folder. Contains controllers, models, routes, DB config, middleware, and integrations.

## Key features
- Movie listing, search, and details pages
- Show listings by theatre and release pages
- Seat layout view and booking workflow
- My Bookings and Favorites pages for users
- Admin area: Add shows, list shows, list bookings, dashboard
- Stripe integration for payments and webhook handling
- Email notifications (nodemailer) for booking confirmations

## Repo structure (high level)
- `client/` — frontend app (Vite + React)
  - `src/pages/` — pages like Home, Movies, MovieDetails, admin pages
  - `src/components/` — UI components
- `server/` — backend API
  - `configs/` — `db.js`, `nodeMailer.js`
  - `controllers/` — request handlers (user, booking, show, theatre, admin)
  - `models/` — Mongoose models (user, movie, show, booking, theatre)
  - `routes/` — express routes wired to controllers
  - `middleware/` — auth and other middleware

## Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas) — provide a connection string via environment variable

## Environment variables
Create a `.env` file (server) or set environment variables for the server. Typical variables used by the server:
- `MONGO_URI` — MongoDB connection string
- `PORT` — server port (e.g., 5000)
- `JWT_SECRET` — JWT signing secret
- `EMAIL_USER` / `EMAIL_PASS` — SMTP credentials (if using nodemailer)
- `STRIPE_SECRET_KEY` — Stripe secret key (for payments)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret (for secure webhook handling)

Check `server/configs/` for how the server loads configuration.

## Run locally (development)

1. Start the server

```bash
cd server
npm install
# create .env with the variables above
npm run dev
```

2. Start the client

```bash
cd client
npm install
npm run dev
```

By default Vite will serve the frontend (usually at `http://localhost:5173`) and the server will run on the port you configured (commonly `http://localhost:5000`). Update the client's API base URL if necessary (check `client/src/context/AppContext.jsx` or where API calls are made).

## API routes (overview)
Look at `server/routes/` for the full list. Main route groups include:
- `userRoutes.js` — user auth and profile
- `bookingRoutes.js` — create/list bookings
- `showRoutes.js` — shows and seat info
- `theatreRoutes.js` — theatre listings and details
- `adminRoutes.js` — admin actions (requires admin auth)

## Admin
The client includes admin pages under `client/src/pages/admin/`. To use the admin UI you need an admin user in the database. You can create one manually by inserting a user document with an admin role, or expose an admin-creation endpoint temporarily.

## Stripe & Webhooks
The server includes webhook handling (`server/controllers/stripeWebhooks.js`) — ensure your `STRIPE_WEBHOOK_SECRET` is set and Stripe is configured. For local webhook testing, use the Stripe CLI to forward events.

## Deployment notes
- There are `vercel.json` files in both the `client/` and `server/` folders; the project was prepared with Vercel deployments in mind. Adjust build settings and environment variables in your chosen host.

## Tests
There are no automated tests included in the repo at the moment. Adding unit/integration tests (Jest, React Testing Library, Supertest) is recommended.

## What I have done (summary)
- Implemented a full-stack movie ticketing prototype with user and admin flows.
- Built frontend components and pages for browsing, searching, viewing trailers, and booking.
- Built backend API with models for movies, shows, theatres, bookings, and users.
- Integrated Stripe for payments and nodemailer for notification emails.

## Next steps / suggestions
- Add automated tests for backend routes and critical frontend flows.
- Add seed scripts to populate sample movies, theatres, and shows.
- Add CI pipeline and review deployment configuration for serverless platform if deploying via Vercel or similar.

## Where to look first
- Frontend entry: `client/src/main.jsx` and `client/src/pages/`
- Backend entry: `server/server.js` and `server/configs/db.js`
- Models: `server/models/`

## Contact / Author
This work is in branch `tasmiad-branch`. For questions or further edits, check the project files in this repository.

---

File: [README.md](README.md)
