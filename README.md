# Akola Civic Watch

Akola Civic Watch is a civic issue reporting platform for citizens and local authorities. Citizens can report road, drainage, waste, water, healthcare, and encroachment issues. Authorities can triage, assign, and resolve complaints through a dashboard.

## Tech Stack

- React.js with Vite
- Tailwind CSS
- React Router
- Leaflet.js with OpenStreetMap
- Node.js + Express.js
- MongoDB Atlas
- Firebase Authentication
- Axios

## Folder Structure

```text
akola-civic-watch/
  client/
  server/
  package.json
  README.md
```

## Getting Started

1. Install dependencies:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

2. Configure environment variables:

- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env`

3. Run the app:

```bash
npm run dev
```

## Environment Variables

### Server

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_STORAGE_BUCKET`

### Client

- `VITE_API_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## What is Included

- Role-based authentication scaffold
- Complaint reporting and tracking models
- Admin and citizen dashboard screens
- Map, filters, and timeline UI
- Sample seed data and API integration layer
