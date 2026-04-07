# Workspace

## Overview

pnpm workspace monorepo with two apps: a premium link-in-bio site and a privacy-first file converter.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (shared backend, mostly unused)
- **Database**: PostgreSQL + Drizzle ORM (available, not used by these apps)

## Artifacts

### link-in-bio (`/`)
A modern, premium link-in-bio website. Fully static React + Vite.

- **Landing page** (`/`) — Hero with CTA
- **Profile pages** (`/u/:username`) — Dynamic static routes from JSON
- **404 page** — Clean minimal design

Key files:
- `artifacts/link-in-bio/src/data/profiles.json` — Add profiles here
- `artifacts/link-in-bio/src/pages/` — Page components
- `artifacts/link-in-bio/src/components/` — Reusable components
- `artifacts/link-in-bio/src/hooks/useTheme.ts` — Dark/light toggle

### file-converter (`/converter/`)
Privacy-first browser-only file conversion tool.

**All processing is client-side — files never leave the browser.**

Supported conversions:
- PDF → JPG, PDF → PNG
- Image → PDF (JPG/PNG)
- TXT → PDF
- JPG ↔ PNG, JPG ↔ WebP, PNG ↔ WebP, WebP → JPG

Key files:
- `artifacts/file-converter/src/lib/converters.ts` — All conversion logic
- `artifacts/file-converter/src/lib/tools.ts` — Tool definitions
- `artifacts/file-converter/src/pages/HomePage.tsx` — Tool grid
- `artifacts/file-converter/src/pages/ToolPage.tsx` — Per-tool convert UI
- `artifacts/file-converter/src/components/FileUploader.tsx` — Drag & drop
- `artifacts/file-converter/src/components/OutputPreview.tsx` — Download UI

Dependencies: `pdf-lib` (PDF creation), `pdfjs-dist` (PDF to image via CDN worker)

### API Server (`/api`)
Express 5 backend — not used by either of the above apps.

## Design Tokens (shared)
- Background: `#0e0e0e` (`0 0% 5.5%`)
- Card: `#171717` (`0 0% 9%`)
- Border: `#2a2a2a` (`0 0% 16.5%`)
- Accent/Primary: `#22c55e` (`142 71% 45%`)
- Muted text: `#a3a3a3` (`0 0% 64%`)
- Typography: Instrument Serif (headings) + Inter (body)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-server run dev` — run API server locally
