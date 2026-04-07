# Workspace

## Overview

pnpm workspace monorepo with two apps: a premium link-in-bio site and a privacy-first file/text utility platform.

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
Privacy-first browser-only file utility platform — 30+ tools across 4 categories.

**All processing is client-side — files never leave the browser.**

#### PDF Tools (9 tools)
- PDF → JPG, PDF → PNG (multi-page)
- Image → PDF (JPG/PNG)
- TXT → PDF
- **PDF Merge** (multiple files → one PDF)
- **PDF Split** (by custom page ranges)
- **PDF Rotate** (selectable degrees + page range)
- **PDF Remove Pages**
- **PDF Extract Pages**

#### Image Tools (9 tools)
- JPG ↔ PNG, JPG ↔ WebP, PNG ↔ WebP, WebP → JPG
- **Image Resize** (width + height inputs)
- **Image Compress** (quality slider)
- **Bulk Image Convert** (multiple files → format)

#### File Tools (2 tools)
- **Extract ZIP** (JSZip)
- **Create ZIP** (JSZip)

#### Text & Dev Tools (8 tools)
- **JSON Formatter** (pretty-print + validate)
- **JSON → CSV** / **CSV → JSON**
- **Base64 Encode / Decode**
- **URL Encode / Decode**
- **Text Case Converter** (upper/lower/title/camelCase/snake_case/kebab/sentence)

#### Key features
- **Smart file detection drop zone** on homepage — drop any file to get suggested tools
- Multi-file uploader for Merge, Bulk Convert, Create ZIP
- Tool controls (sliders, selectors, text inputs) per tool
- Text tool panel with textarea in/out + copy/download

Key files:
- `artifacts/file-converter/src/lib/tools.ts` — All tool definitions, detectCategory()
- `artifacts/file-converter/src/lib/converters.ts` — Existing image/PDF converters
- `artifacts/file-converter/src/lib/pdf-tools.ts` — New PDF tools (merge/split/rotate/etc)
- `artifacts/file-converter/src/lib/image-tools.ts` — Resize, compress, bulk convert
- `artifacts/file-converter/src/lib/file-tools.ts` — ZIP operations (jszip)
- `artifacts/file-converter/src/lib/text-tools.ts` — JSON, Base64, URL, case conversion
- `artifacts/file-converter/src/pages/HomePage.tsx` — Smart drop zone + 4-category grid
- `artifacts/file-converter/src/pages/ToolPage.tsx` — Unified tool page (file/multi-file/text)
- `artifacts/file-converter/src/components/MultiFileUploader.tsx` — Multi-file drag/drop
- `artifacts/file-converter/src/components/ToolControls.tsx` — Dynamic control rendering
- `artifacts/file-converter/src/components/TextToolPanel.tsx` — Text-in/out UI
- `artifacts/file-converter/src/components/FileUploader.tsx` — Single-file drag/drop
- `artifacts/file-converter/src/components/OutputPreview.tsx` — Download results

Dependencies: `pdf-lib` (PDF creation/manipulation), `pdfjs-dist` (PDF→image via CDN worker), `jszip` (ZIP operations)

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
