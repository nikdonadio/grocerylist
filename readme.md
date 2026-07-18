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
| Mobile | React Native + Expo SDK 54 — native Android APK via EAS Build |
| Database | PostgreSQL (Railway) |
| Deploy | Railway (backend + frontend + DB) |

> Original plan targeted AWS Lambda + API Gateway + DynamoDB. That plan was
> abandoned due to AWS account verification blockers; see
> [`docs/MASTER PROMPT - AI-Driven MVP Dev.md`](<docs/MASTER PROMPT - AI-Driven MVP Dev.md>)
> section 2 for the full history. The `legacy-aws` branch is kept as a frozen
> snapshot of that original stack.

---

## Production status

| Service | Status | URL / detail |
|---|---|---|
| Backend | ✅ Online | `https://grocerylist-production-ddd6.up.railway.app` |
| Frontend web | ✅ Online | `https://brave-stillness-production-483f.up.railway.app` |
| Mobile | ✅ Built & installed | Android APK, app ID `app.grocerylist.family`, connects directly to the Railway backend (no Expo Go) |
| Database | ✅ Online | PostgreSQL on Railway (Amsterdam) |

### Mobile app features

Full CRUD via `TokenScreen` + `ListScreen`; visual separation of pending vs.
in-cart items; access token persisted in AsyncStorage; per-item loading
states; safe retry on toggle (not on add, to avoid duplicates); auto-refresh
on add failure; list name shown in the header.

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
├── mobile/       # React Native/Expo app (Android APK live)
├── specs/        # Product spec — what the app is/does now (spec.md)
└── docs/         # Process docs: master prompt, dev log (bitacora.md), session logs
```

---

## Project documentation map

This repo keeps process and product documentation separate to avoid
contradictions:

| Document | Answers... |
|---|---|
| [`docs/MASTER PROMPT - AI-Driven MVP Dev.md`](<docs/MASTER PROMPT - AI-Driven MVP Dev.md>) | How we work: branching, Jira, commit discipline, dev environment |
| [`specs/spec.md`](specs/spec.md) | What the product is right now: requirements, current stack, endpoints, architecture rules |
| [`docs/bitacora.md`](docs/bitacora.md) | When and why something changed — chronological decision log |

Project management: [Jira board GL](https://nicolasdonadio.atlassian.net/jira/software/projects/GL/boards/34).

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

### Mobile

```bash
cd mobile
npm install
npm start               # Expo dev server; scan QR with Expo Go, or:
npm run android          # open on a connected Android device/emulator
```

For a native build (no Expo Go), use EAS Build — see EAS/Expo docs for
`eas build -p android`.

---

## Branching Strategy

- `main` → production, autodeploy on Railway (backend/frontend) + EAS Build (mobile)
- `dev-railway` → daily working branch
- `legacy-aws` → snapshot of original AWS stack

Flow: `dev-railway` → PR + CodeRabbit review → merge to `main` → autodeploy.
Full branching/commit/PR conventions: see
[`docs/MASTER PROMPT - AI-Driven MVP Dev.md`](<docs/MASTER PROMPT - AI-Driven MVP Dev.md>).

---

## MVP Scope

**Included**
- Single shared shopping list
- Access via secret token in URL
- Add / update / delete items
- Mark items as purchased
- Refresh-based synchronization
- Native Android app (APK)

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
