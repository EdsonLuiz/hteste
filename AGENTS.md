# AGENTS.md - 02-weather

## Project Overview
Weather CLI app using **Bun.js** + **TypeScript** + **OpenMeteo API**. Entry point: `index.ts`.

## Feature Workflow

Follow this process for all changes to `main`:

1. **Create feature branch** from `main`:
   ```bash
   git checkout -b <type>/<description> main
   ```

2. **Make changes**, commit with Conventional Commits:
   ```bash
   git add -A && git commit -m "feat: add new feature"
   ```

3. **Push branch** and create PR:
   ```bash
   git push -u origin <branch-name>
   gh pr create --repo EdsonLuiz/hteste --base main --head <branch-name> \
     --title "feat: <description>" --body "<details>"
   ```

4. **Self-approve** (required since `main` has branch protection):
   ```bash
   gh pr review <PR_NUMBER> --approve
   ```

5. **Merge** (no `--admin` needed, `enforce_admins=false`):
   ```bash
   gh pr merge <PR_NUMBER> --repo EdsonLuiz/hteste --merge --delete-branch
   ```

6. **Update local** after merge:
   ```bash
   git checkout main && git pull origin main
   ```

**Important Notes:**
- Branch protection: 1 required review, stale reviews dismissed on new commits
- `enforce_admins=false` allows self-approval
- Never push directly to `main`
- Keep `README.md` from this project (not boilerplate)

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
