# Realtime Chat Application

Realtime chat app with a TypeScript React frontend and a TypeScript NestJS + Socket.IO backend.

## Local Development

Backend:

```bash
cd server
PORT=5010 npm run start:dev
```

Frontend:

```bash
cd client
npm start
```

The committed frontend example env points to the backend shape:

```bash
REACT_APP_SOCKET_URL=http://localhost:5010
```

## Deploy Backend To Render

Create a Render Web Service from this repo.

Recommended settings:

```text
Root Directory: server
Build Command: npm install && npm run build
Start Command: npm start
```

Render provides `PORT` automatically. Add these env vars after you know your Vercel URL:

```bash
CORS_ORIGIN=https://your-vercel-app.vercel.app
SOCKET_CORS_ORIGIN=https://your-vercel-app.vercel.app
```

For multiple allowed frontend URLs, use commas:

```bash
CORS_ORIGIN=https://your-vercel-app.vercel.app,https://your-custom-domain.com
SOCKET_CORS_ORIGIN=https://your-vercel-app.vercel.app,https://your-custom-domain.com
```

There is also a root `render.yaml` blueprint you can use, but replace the placeholder Vercel URL before relying on it.

## Deploy Frontend To Vercel

Create a Vercel project from this repo.

Recommended settings:

```text
Root Directory: client
Framework Preset: Create React App
Build Command: npm run build
Output Directory: build
```

Add this Vercel env var:

```bash
REACT_APP_SOCKET_URL=https://your-render-service.onrender.com
```

Redeploy the frontend after changing `REACT_APP_SOCKET_URL`; Create React App embeds that value at build time.

## Repo Recommendation

Keep this as a monorepo for now. It is simpler because the frontend and backend share one project history, one PR, and coordinated Socket.IO contract changes. Both Vercel and Render support deploying subdirectories from a monorepo.

Split into separate repos only if frontend and backend will have different teams, independent release cycles, or very different permission/security needs.
