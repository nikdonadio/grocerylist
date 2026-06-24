# Getting started

## Prerequisites

- Node.js 20+
- AWS CLI configured (`aws configure`)
- Serverless Framework: `npm install -g serverless`

---

## 1. Backend — install & deploy

```bash
cd backend
npm install
serverless deploy
```

After deploy, copy the API Gateway URL from the output. It looks like:
`https://abc123.execute-api.eu-west-1.amazonaws.com/dev`

---

## 2. Frontend — configure & run

```bash
cd frontend
npm install

# Create your local env file
cp .env.example .env.local
# Edit .env.local and paste the API Gateway URL:
# VITE_API_URL=https://abc123.execute-api.eu-west-1.amazonaws.com/dev

npm run dev
```

Open: `http://localhost:5173/list/my-family-secret`

The token in the URL (`my-family-secret`) is your list ID — share that URL with family.

---

## 3. Local development (backend + frontend together)

Terminal 1 — backend offline:
```bash
cd backend
npx serverless offline
```

Terminal 2 — frontend:
```bash
cd frontend
npm run dev
```

Open: `http://localhost:5173/list/test-token`
The Vite proxy forwards `/api/*` → `http://localhost:3000`

---

## 4. Deploy frontend (optional)

Build the static files and host on S3, Netlify, or Vercel:
```bash
cd frontend
npm run build
# dist/ folder is ready to upload
```
