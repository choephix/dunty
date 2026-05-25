# Dunty — Development Guide

Browser-based card-combat dungeon-crawling game built with PixiJS + Vite + TypeScript.

## Cursor Cloud specific instructions

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Vite dev server | `pnpm dev` | 14445 | Only service needed; serves the client-side SPA |

### Key commands

- **Typecheck:** `pnpm typecheck`
- **Build:** `pnpm build` (runs `tsc && vite build`)
- **Dev server:** `pnpm dev` (Vite on port 14445)
- **Preview prod build:** `pnpm preview` (port 8080)

### Gotchas

- pnpm's build-script allow-list may skip `esbuild` postinstall. If Vite fails to start, run `pnpm rebuild esbuild`.
- No ESLint config file exists despite eslint being in devDependencies; `eslint .` will not produce useful results without a config.
- TypeScript version is pinned to `4.7.0-beta`.
- Card data from Airtable is commented out in `src/dungeon/main/main.ts`; game uses hardcoded card pools instead.
- The project uses path aliases (`@dir` → `src/dir`) configured in both `tsconfig.json` and `vite.config.ts`.
- External assets load from CDN (`undroop-assets.web.app`); the game renders but some textures may be missing if those are unreachable.
