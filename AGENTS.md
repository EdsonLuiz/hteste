# AGENTS.md - 02-weather

## Project Overview
Weather CLI app using **Bun.js** + **TypeScript** + **OpenMeteo API**. Entry point: `index.ts`.

## Commands
- **Run**: `bun run index.ts`
- **Build binary**: `bun build index.ts --compile --outfile weather`
- **Typecheck**: `bunx tsc --noEmit` (uses tsconfig.json)

## Stack Details
- Runtime: Bun (not Node.js)
- Module system: ES modules (`"type": "module"` in package.json)
- API: OpenMeteo (geocoding + forecast endpoints)
- No test/lint tooling configured yet

## Architecture Notes
- Single entry point at `index.ts` (currently just "Hello via Bun!")
- Menu-driven CLI with options for default city, multiple cities, settings
- Uses Bun's built-in fetch (undici) for HTTP requests
- tsconfig: strict mode, bundler resolution, no emit

## Key Files
- `index.ts` - Main entry point
- `tsconfig.json` - TypeScript config (strict, ESNext, bundler mode)
- `package.json` - Bun project config, private module

## Commit Style
Use **Conventional Commits** with a short scope-less subject following the pattern seen in previous commits:
- `feat: <description>` - new feature/functionality
- `docs: <description>` - documentation changes
- `chore: <description>` - maintenance/tooling changes

Examples from the repo:
- `feat: add weather CLI application with multi-city support...`
- `docs: create agents.md`
- `chore: add build result`

## Development Notes
- No existing tests or CI
- No formatter/linter configured (Bun has built-in formatting via `bun fmt` if needed)
- Dependencies managed via bun.lock
