# Productivity Tracker Backend

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   npm run dev
   ```
   or
   ```
   npm start
   ```

- The server runs on http://localhost:4000
- Endpoints:
  - `POST /api/time` — Save time entry `{ domain, seconds, date }`
  - `GET /api/analytics/weekly?start=YYYY-MM-DD&end=YYYY-MM-DD` — Get weekly analytics 