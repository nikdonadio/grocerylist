# Family Shopping List App — AI-First MVP Experiment

## Purpose

This project has two objectives:

### 1. Product Objective

A minimal shared shopping list for families:
- Add items collaboratively
- Check items while shopping
- Shared via a secret URL token
- No login, no accounts

### 2. Engineering Experiment Objective

This project is also a controlled experiment in:

> Rapid software development using AI as the primary implementation tool

The goal is to evaluate:
- How fast a full-stack application can be built using AI assistance
- How much manual coding is actually required
- How reliable AI-generated architectures are in real deployment scenarios
- Whether AI-first development can replace traditional incremental engineering workflows for MVPs

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express + TypeScript |
| Frontend web | React + Vite + TypeScript |
| Mobile | React Native + Expo *(coming soon)* |
| Database | PostgreSQL (Railway) |
| Deploy | Railway (backend + frontend + DB) |

---

## Production URLs

| Service | URL |
|---|---|
| Backend | `https://grocerylist-production-ddd6.up.railway.app` |
| Frontend | `https://brave-stillness-production-483f.up.railway.app` |

---

## API

```
GET    /health
GET    /list/:accessToken
POST   /list/:accessToken/items        body: { name: string }
PUT    /list/:accessToken/items/:id    body: { checked?: boolean, name?: string }
DELETE /list/:accessToken/items/:id
```

---

## Repo Structure

```
grocerylist/
├── backend/      # Express API
├── frontend/     # React/Vite web app
├── mobile/       # React Native/Expo app (coming soon)
└── docs/         # Development log
```

---

## Local Development

### Backend

```bash
cd backend
cp .env.example .env   # fill in DATABASE_URL
npm install
npm run db:migrate
npm run dev            # port 3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # port 5173, proxy → localhost:3001
```

---

## Branching Strategy

- `main` → production, autodeploy on Railway
- `dev-railway` → daily working branch
- `legacy-aws` → snapshot of original AWS stack

Flow: `dev-railway` → PR + CodeRabbit review → merge to `main` → autodeploy.

---

## MVP Scope

**Included**
- Single shared shopping list
- Access via secret token in URL
- Add / update / delete items
- Mark items as purchased
- Refresh-based synchronization

**Excluded**
- Authentication
- User accounts
- Real-time sync
- Offline mode
- Analytics

---

## Success Criteria

The project is successful if:
- It can be fully built and deployed using AI-assisted development
- A real family can use it in grocery shopping scenarios
- The system remains simple and maintainable
- Development time is significantly reduced compared to traditional workflows

---

## Dev Log

See [`docs/bitacora.md`](docs/bitacora.md) for the full history of decisions and development sessions.

---

> This project is experimental and intended for learning purposes.
