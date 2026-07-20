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
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Database setup commands will be added with issue #2.

## Current validation

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Unit and Playwright commands will be added under issue #8. Pull requests are checked by GitHub Actions.

## Working on the project

Read [CONTRIBUTING.md](CONTRIBUTING.md), [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md), and [STATUS.md](STATUS.md) before making changes. Work is tracked in [GitHub issues](https://github.com/anjananadee23/IS4105-ACSDD/issues).

The assignment assesses the AI-assisted workflow as well as the result. Record prompts, important corrections, validation, screenshots, and hands-on time in `docs/` as work happens. Do not reconstruct or fabricate evidence later.
