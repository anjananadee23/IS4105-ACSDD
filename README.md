# CeylonCart

CeylonCart is a small e-commerce MVP for locally made Sri Lankan products, built for the IS4105 / CS4127 AI-Assisted Software Engineering assignment.

## MVP scope

The mandatory journey is product catalogue -> product details -> cart -> checkout -> simulated payment -> order confirmation. Real payments and real customer data are intentionally excluded.

## Stack

- Next.js App Router with TypeScript
- Shadcn UI preset `b7kBsBkh7b` (Nova, zinc, green)
- SQLite with Drizzle ORM
- Zod validation
- pnpm

## Quick start

Prerequisites: Node.js 22, pnpm, and Git.

```bash
git clone https://github.com/anjananadee23/IS4105-ACSDD.git
cd IS4105-ACSDD
pnpm install
pnpm db:setup
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). By default, SQLite data is written to `data/ceyloncart.db`; set `DATABASE_URL` to override the path.

## Current validation

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The current unit suite verifies the generated migration and repeatable 12-product seed. Playwright coverage will be added under issue #8.

## Working on the project

Read [CONTRIBUTING.md](CONTRIBUTING.md), [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md), and [STATUS.md](STATUS.md) before making changes. Work is tracked in [GitHub issues](https://github.com/anjananadee23/IS4105-ACSDD/issues).

The assignment assesses the AI-assisted workflow as well as the result. Record prompts, important corrections, validation, screenshots, and hands-on time in `docs/` as work happens. Do not reconstruct or fabricate evidence later.
