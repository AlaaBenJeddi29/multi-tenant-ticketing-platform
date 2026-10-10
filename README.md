<div align="center">

# Multi-Tenant Ticketing Platform

**A SaaS-ready helpdesk platform — isolated organizations, role-based access, SLA tracking, and rule-based automation.**

[![CI](https://github.com/AlaaBenJeddi29/multi-tenant-ticketing-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/AlaaBenJeddi29/multi-tenant-ticketing-platform/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](#tech-stack)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](#tech-stack)
[![Express 5](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](#tech-stack)
[![Prisma 7](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](#tech-stack)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](#tech-stack)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](#docker)

[Overview](#overview) · [Features](#features) · [Architecture](#architecture) · [Getting Started](#getting-started) · [Docker](#docker) · [Testing](#testing) · [Deployment](docs/DEPLOYMENT.md)

</div>

---

## Overview

This is a full-stack, multi-tenant support ticketing platform built as a production-style
project. Multiple organizations share one deployment while keeping their data strictly
isolated, and a platform-level super-admin manages the tenants themselves.

Each organization gets its own categories, priorities, assets, requesters, tickets, SLAs,
and automation rules — plus a **white-label public portal** where its requesters can submit
tickets without an account.

> **Status:** actively developed. Built as a summer internship project and hardened toward
> production: typed end to end, containerized, tested, and validated in CI.

---

## Features

**Multi-tenancy & access control**
- Row-level tenant isolation — every record is scoped to an organization
- Three roles: `SUPER_ADMIN` (platform), `ORG_ADMIN`, `AGENT`
- JWT auth with **short-lived access tokens** and **rotating refresh tokens** in `httpOnly` cookies
- Session management: list and revoke active sessions, revoke all others
- Three-step password reset (request → verify code → set new password)
- Per-request authorization middleware and tenant guards

**Ticketing**
- Tickets with status lifecycle (`NEW → IN_PROGRESS → WAITING_REQUESTER → RESOLVED → CLOSED`)
- Human-readable, per-organization unique ticket numbers assigned under concurrency
- Priorities, categories, assets, and requester records
- Threaded comments (internal + requester-facing)
- Assignment to agents, source tracking, and full audit fields

**SLA & automation**
- Per-priority SLA policies (response + resolution targets)
- Automatic due-time calculation with response/resolution **breach detection**
- Rule engine: trigger + condition + action (assign, change status/priority, comment, notify, email, close/reopen, webhook)
- Execution log for every automation run, with scheduled jobs for SLA sweeps

**Notifications, email & public portal**
- In-app notifications with read state
- Pluggable email delivery (SMTP in production; console logging when unconfigured)
- White-label public portal: per-org landing page + account-free ticket submission, rate-limited

**Dashboard & administration**
- Org dashboard and platform admin dashboard with charts and analytics
- Organization management (create, suspend, activate, inspect)
- System health, activity feed, and user administration
- Server-side pagination, search, and filtering across list views

**Security**
- `helmet` security headers, strict CORS allow-list, `bcrypt` password hashing
- Global and route-specific rate limiting
- Zod validation on request bodies at the API boundary

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, TypeScript, React Router 7, TanStack Query 5 |
| **UI** | Tailwind CSS 4, shadcn/ui + Radix, lucide-react, Recharts, sonner |
| **Forms & validation** | React Hook Form, Zod 4 |
| **Backend** | Node.js 24, Express 5, TypeScript |
| **Database** | PostgreSQL 16 via Prisma 7 (`@prisma/adapter-pg`) |
| **Auth** | JSON Web Tokens, rotating refresh tokens, httpOnly cookies, bcrypt |
| **Testing** | Vitest (unit + integration), Supertest |
| **Tooling** | ESLint 9, Docker, Docker Compose, GitHub Actions |

---

## Architecture

```
        ┌──────────────┐      HTTPS       ┌───────────────────────────────┐
        │   Browser    │ ───────────────▶ │  nginx  (client image)        │
        │  React 19 SPA│                  │  • serves static assets + SPA │
        └──────────────┘                  │  • /api/* → server:5000       │
                                          └───────────────┬───────────────┘
                                                          │  HTTP
                                          ┌───────────────▼───────────────┐
                                          │  Express 5 API  (server)      │
                                          │  • JWT auth + RBAC middleware │
                                          │  • feature modules + services │
                                          │  • Zod validation, rate limit │
                                          │  • Prisma 7 + pg driver        │
                                          └───────────────┬───────────────┘
                                                          │  SQL
                                          ┌───────────────▼───────────────┐
                                          │  PostgreSQL 16                │
                                          │  • tenant-isolated tables     │
                                          │  • committed Prisma migrations│
                                          └───────────────────────────────┘
```

Request flow: `SPA → nginx (same-origin /api) → Express module → service → Prisma → Postgres`.
Auth uses a short-lived access cookie plus a refresh cookie scoped to `/api/auth`, so protected
routes never receive the refresh token.

---

## Repository Structure

```
multi-tenant-ticketing-platform/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── app/                 # router, providers, layouts
│   │   ├── features/            # feature modules (tickets, auth, admin, …)
│   │   ├── components/ui/       # design-system primitives
│   │   └── api/                 # axios client + interceptors
│   ├── Dockerfile               # multi-stage build → nginx
│   └── nginx.conf               # SPA fallback + /api reverse proxy
├── server/                      # Express + Prisma backend
│   ├── src/
│   │   ├── modules/             # auth, tickets, sla, automation, admin, …
│   │   ├── middleware/          # auth, authorization, rate limiting, errors
│   │   ├── lib/                 # prisma, jwt, cookies, email, AppError
│   │   └── config/              # validated environment
│   ├── prisma/                  # schema + committed migrations
│   └── Dockerfile               # multi-stage build + migrator target
├── docs/
│   └── DEPLOYMENT.md            # production deployment guide
├── .github/workflows/ci.yml     # CI: typecheck + unit + integration tests
└── docker-compose.yml           # Postgres + migrate + server + client
```

---

## Getting Started

### Prerequisites

- **Node.js 24** (LTS) and npm
- **PostgreSQL 16** (local, Docker, or managed)

### 1. Clone

```bash
git clone https://github.com/AlaaBenJeddi29/multi-tenant-ticketing-platform.git
cd multi-tenant-ticketing-platform
```

### 2. Backend

```bash
cd server
npm ci
cp .env.example .env          # then edit the values (see Environment Variables)
npm run db:generate           # generate the Prisma client
npm run db:deploy             # apply committed migrations
npm run seed:super-admin      # create the platform super-admin (optional)
npm run dev                   # http://localhost:5000
```

### 3. Frontend

```bash
cd client
npm ci
cp .env.example .env          # VITE_API_URL=/api  (or an absolute API URL)
npm run dev                   # http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:5000`, so the frontend and backend run
side by side without CORS configuration.

---

## Environment Variables

**Server** (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | yes | API port (default `5000`) |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `JWT_SECRET` | yes | Signs/verifies tokens — use a long random value in production |
| `NODE_ENV` | yes | `development` or `production` |
| `CLIENT_URL` | yes | Frontend origin for CORS / cookie origin (exact match) |
| `TEST_DATABASE_URL` | tests | Isolated DB for integration tests (name must contain `test`) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` | no | Real email delivery (logs to console when unset) |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` / `SUPER_ADMIN_FIRST_NAME` / `SUPER_ADMIN_LAST_NAME` | no | Only used by the seed script |

**Client** (`client/.env`, build-time)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for API requests (e.g. `/api` behind the bundled proxy) |
| `VITE_API_BASE` | Legacy alias kept in sync with `VITE_API_URL` |

> Never commit real secrets. `server/.env`, `client/.env`, and the Compose `.env` are gitignored.

---

## Database & Migrations

Schema lives in `server/prisma/schema.prisma`; migrations are **explicit** and committed.

```bash
cd server
npm run db:generate    # prisma generate
npm run db:deploy      # prisma migrate deploy   (apply pending migrations)
npm run db:status      # prisma migrate status   (show what is pending)
```

`prisma migrate deploy` is non-destructive. Do **not** run `migrate reset` or `db push`
against a database that holds data.

---

## Testing

```bash
cd server
npm test               # unit tests (Vitest)
npm run typecheck:tests
npm run test:integration   # integration tests against an isolated database
cd ../client && npx tsc -b # frontend type-check
```

Integration tests refuse to run unless `TEST_DATABASE_URL` is set and points at a database
whose name contains `test` — they never fall back to the development database.

---

## Docker

The Compose stack runs a production-like environment: PostgreSQL with a persistent volume, a
one-off migration job, the API, and an nginx-served SPA.

```bash
cp .env.docker.example .env      # set POSTGRES_PASSWORD, JWT_SECRET, CLIENT_URL
docker compose build
docker compose up -d db
docker compose run --rm migrate  # explicit, non-destructive migrations
docker compose up -d server client
```

The client is served at `http://localhost:8080` and proxies `/api` to the API. See
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the full guide (migrations, backups,
HTTPS, and provider-specific configuration).

---

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pushes to `main` and pull
requests targeting `main`:

- **Server** — spins up a disposable PostgreSQL service, generates the Prisma client, applies
  migrations, then runs the production type-check, the test type-check, unit tests, and
  integration tests.
- **Client** — installs dependencies and type-checks the app.

CI uses only throwaway service-container databases and never touches developer credentials.

---

## API Overview

All application routes are mounted under `/api` and return JSON.

| Group | Base path | Notes |
|---|---|---|
| Auth | `/api/auth` | login, register, refresh, logout, password reset, sessions, profile |
| Public | `/api/public` | `POST /:organizationSlug/submit` — account-free submission (rate-limited) |
| Tickets | `/api/tickets` | list, create, detail, update, assign, comments |
| Categories / Priorities | `/api/categories`, `/api/priorities` | org-scoped reference data |
| Assets / Requesters | `/api/assets`, `/api/requesters` | org-scoped records |
| SLAs | `/api/slas` | SLA policies per priority |
| Automation | `/api/automation` | rules + execution history |
| Comments | `/api/comments` | ticket threads |
| Notifications | `/api/notifications` | in-app notifications |
| Dashboard | `/api/dashboard` | org metrics |
| Users | `/api/users` | org user management |
| Organizations / Admin | `/api/organizations`, `/api/admin` | `SUPER_ADMIN` platform administration |

---

## Roadmap

- [ ] License the project
- [ ] Add screenshots / demo walkthrough
- [ ] Frontend test suite
- [ ] Code-split the client bundle
- [ ] Refresh-token reuse detection
- [ ] OpenAPI specification for the API

---

## Contributing

Contributions are welcome.

1. Fork the repository and create a feature branch (`feat/short-description`).
2. Keep changes focused; match the existing TypeScript and module conventions.
3. Run `npm test` (server) and `npx tsc -b` (client) before opening a PR.
4. Open a pull request describing the change and how you verified it.

---

## License

No license has been added to this repository yet. Add a `LICENSE` file (for example, MIT) before
using or distributing this code.

---

<div align="center">

Built as a Summer Internship project · [Deployment Guide](docs/DEPLOYMENT.md)

</div>
