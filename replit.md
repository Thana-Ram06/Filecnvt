# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a premium link-in-bio website and supporting infrastructure.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### link-in-bio (`/`)
A modern, premium link-in-bio website. Fully static React + Vite app.

- **Landing page** (`/`) — Hero section with brand identity and CTA
- **Profile pages** (`/u/:username`) — Dynamic routes reading from static JSON data
- **404 page** — Clean "User not found" experience

**Key files:**
- `artifacts/link-in-bio/src/data/profiles.json` — Profile data (add profiles here)
- `artifacts/link-in-bio/src/pages/LandingPage.tsx` — Hero landing page
- `artifacts/link-in-bio/src/pages/ProfilePage.tsx` — User profile page
- `artifacts/link-in-bio/src/pages/NotFoundPage.tsx` — 404 page
- `artifacts/link-in-bio/src/components/LinkCard.tsx` — Individual link button
- `artifacts/link-in-bio/src/components/ThemeToggle.tsx` — Light/dark mode toggle
- `artifacts/link-in-bio/src/components/CopyButton.tsx` — Copy profile URL button
- `artifacts/link-in-bio/src/hooks/useTheme.ts` — Theme persistence hook

**Design:**
- Dark mode default, light mode toggle
- Color: `#0e0e0e` background, `#22c55e` green accent
- Typography: Instrument Serif (headings) + Inter (body)
- Fully responsive, mobile-first
- Smooth animations and hover effects

### API Server (`/api`)
Express 5 backend (unused by link-in-bio, kept for future use).

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
