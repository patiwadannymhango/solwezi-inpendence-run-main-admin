# Solwezi Independence Run 2026 — Admin Dashboard

A React admin dashboard for the [solwezi-inpendence-run-api](../solwezi-inpendence-run-api)
backend, built with Vite, TypeScript, and Material UI (Material Design 2)
in the layout of MUI's
[dashboard template](https://mui.com/material-ui/getting-started/templates/dashboard/).

## What's here

- **Overview** — live stat cards (total registrations, confirmed/pending
  revenue, race categories), a category breakdown chart, a status
  breakdown chart, recent registrations, and race capacity.
- **Registrations** — searchable/filterable/sortable table of every
  registration, a detail drawer (participant info, payment history,
  status update, delete), a walk-in "manual registration" form, CSV/XLSX
  bulk upload with a per-row error report, and an XLSX export.
- **Payments** — searchable/filterable table of every payment attempt
  across all registrations.
- **Race categories** — list, create, and edit the event's race
  categories (price, capacity).
- **Vendors** & **Vendor categories** — the same registration, detail
  drawer, walk-in form, and export flow for market/stall vendors, plus
  management of the vendor category list.
- **Admin users** — list, create, edit, and deactivate admin accounts
  (Admin vs. View-only roles), mirroring the backend's permission model.
- **Profile** — edit your own name/phone and change your password.
- Light/dark/system theme, responsive layout (collapsible nav on
  mobile), JWT auth with automatic access-token refresh.

Every screen calls the real backend admin API — there is no mock data.

## Running locally

Requires the backend running first (see
[solwezi-inpendence-run-api/README.md](../solwezi-inpendence-run-api/README.md)) —
by default at `http://localhost:8002`.

```bash
npm install
cp .env.example .env   # defaults to http://localhost:8002, edit if needed
npm run dev
```

Vite will pick the first free port starting at 5173. Sign in with an
existing admin account (created via `python manage.py createsuperuser`
or the "New admin account" screen once you have one admin logged in).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Configuration

`VITE_API_BASE_URL` (in `.env`) — the backend's origin, no trailing
slash and no `/api/v1` suffix (e.g. `http://localhost:8002` or
`https://15-240-170-199.sslip.io`). The backend's `CORS_ALLOWED_ORIGINS`
must include this dashboard's origin (it already lists `localhost:5173`
through `localhost:5178` for local dev).
