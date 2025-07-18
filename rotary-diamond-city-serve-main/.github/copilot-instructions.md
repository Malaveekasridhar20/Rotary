# Copilot Instructions for Rotary Diamond City Serve & Tricity Dashboard Manager

## Architecture Overview
- This workspace contains two main projects:
  - **rotary-diamond-city-serve-main**: Main website and backend (Node.js, Express, SQLite, Vite/React frontend)
  - **tricity-dashboard-manager-main**: Admin dashboard (Node.js, Express backend, Vite/React frontend)
- Both backends can be configured to use a shared SQLite database file for real-time data sync.
- File uploads are handled via dedicated endpoints (see `upload-server.cjs`, `simple-backend.cjs`).

## Data Flow & Integration
- **Admin dashboard** (tricity-dashboard-manager-backend) manages events, members, and projects via REST API endpoints (see `server.js`).
- **Main website** reads from the same SQLite DB for live data; ensure both backends point to the same `.db` file for real-time updates.
- File uploads are stored in `/uploads` and served statically.
- No in-memory caching: always query the database for latest data.

## Developer Workflows
- **Install dependencies:** `npm install` in each project directory.
- **Initialize DB (admin backend):** `node server.js` then `node seed.js`.
- **Start servers:** `npm start` (default ports: 3000/3001/3030/3031; change as needed to avoid conflicts).
- **Frontend dev:** `npm run dev` (Vite, hot reload enabled).
- **API endpoints:** See backend `README.md` for routes (e.g., `/api/events`, `/api/members`).

## Project Conventions & Patterns
- **Express** is used for all backend APIs.
- **SQLite** is the default DB; connection path is hardcoded—update both backends to use the same file for shared data.
- **Uploads:** Use `multer` for file uploads; see `simple-backend.cjs` and `upload-server.cjs` for patterns.
- **Frontend:** React with Vite, Tailwind CSS for styling, components in `src/components`.
- **No global state management** (e.g., Redux); context/hooks used for local state.
- **CORS** enabled for local dev origins (see `simple-server.cjs`).

## Key Files & Directories
- `rotary-backend/` and `tricity-dashboard-manager-backend/`: Express+SQLite backends
- `src/components/`: React UI components (both projects)
- `public/`: Static assets and HTML entry points
- `upload-server.cjs`, `simple-backend.cjs`: File upload logic
- `README.md`: Basic setup and workflow instructions

## Example: Shared SQLite Connection
```js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('C:/Users/PRAVEEN/Downloads/shared-db/database.db');
```

## Tips
- Always check/resolve port conflicts before starting servers.
- For real-time UI, implement polling or WebSockets on the frontend (not present by default).
- When adding new API endpoints, follow the RESTful patterns in `server.js` and `simple-backend.cjs`.

---
_Last updated: July 2025. Please update this file if major architectural or workflow changes are made._
