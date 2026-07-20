# Contributing to CeylonCart

CeylonCart is a time-boxed Next.js e-commerce MVP. Complete mandatory requirements FR1-FR6 before proposing authentication, admin tools, or other optional features. Read `AGENTS.md`, `CLAUDE.md`, `STATUS.md`, and the active GitHub issue before editing.

## Prerequisites

- Node.js 22.x (planned CI version)
- pnpm
- Git

## Fastest local setup

The Next.js application lives at the repository root:

```bash
git clone https://github.com/anjananadee23/IS4105-ACSDD.git
cd IS4105-ACSDD
pnpm install
pnpm db:setup
pnpm dev
```

Open `http://localhost:3000`.

### SQLite setup

The default database is `data/ceyloncart.db`. To select a different local path, copy the example environment file and edit `DATABASE_URL` before setup:

```bash
cp .env.example .env.local
pnpm db:setup
```

Use `pnpm db:migrate` to apply committed migrations and `pnpm db:seed` to rerun the idempotent 12-product seed independently.

Do not commit `.env*` files containing local configuration or generated SQLite database files.

## Development commands

Run these from the repository root:

```bash
pnpm dev        # available: local development server
pnpm lint       # available: ESLint
pnpm typecheck  # available: TypeScript validation
pnpm build      # available: production build
pnpm format     # available: format TypeScript/TSX
pnpm test       # available: Vitest unit/database tests
pnpm test:e2e   # planned/TODO: Playwright
```

Never report a command as passing unless it was executed successfully in the current worktree.

## Issues, branches, and pull requests

- Use one focused issue per coherent deliverable and stay within its acceptance criteria.
- Use concise branch names such as `feat/catalogue`, `fix/cart-total`, or `chore/ci`.
- Write outcome-focused commit messages; do not name the AI tool in place of the outcome.
- Reference the issue in the pull request and describe scope, screenshots where useful, and exact validation run.
- Review generated diffs and preserve unrelated work already in the worktree.

## Required validation

Before declaring a task complete, run every currently available check:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm test:e2e` becomes required when its planned script is added. The finished project must include a Playwright catalogue-to-confirmation happy path and a payment-failure/retry test.

## Safe data and payment rules

- Use fictional customer, delivery, and payment data only.
- Never store card numbers, security codes, or other payment credentials.
- Keep the fake payment outcome deterministic and document the dummy failure input.
- Store monetary values as integer cents and derive order totals on the server from product data.
- Use local or explicitly licensed product images; do not commit secrets or generated databases.

## AI-assisted workflow evidence

For each meaningful AI-assisted change, update `docs/ai-workflow.md` with the prompt or faithful summary, accepted output, rejected approaches or human corrections, and validation performed. Capture useful screenshots, track active implementation time in `docs/time-log.md`, and update `STATUS.md` at handoff. Never invent prompts, timing, screenshots, test results, or completed functionality.

## Troubleshooting

If setup or a command fails, confirm you are at the repository root, check Node and pnpm versions, reinstall with the committed lockfile when one exists, and compare the repository state with `STATUS.md`. If a documented script is marked planned/TODO, do not improvise a success claim—record the missing command and continue with the checks that are available.
