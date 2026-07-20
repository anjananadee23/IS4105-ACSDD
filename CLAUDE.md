# CLAUDE.md

Guidance for Claude and other AI coding assistants working on CeylonCart.

## Project goal

Build a small, demonstrable e-commerce MVP for the IS4105 / CS4127 AI-Assisted Software Engineering assignment. The completed product must cover all mandatory requirements before optional work is attempted:

1. Catalogue containing 8-12 products.
2. Individual product details.
3. Cart with add, remove, quantity, and total controls.
4. Checkout collecting customer and delivery details.
5. Simulated payment with success and failure outcomes.
6. Confirmation containing an order summary and generated order ID.

The assignment limits hands-on development to three hours. Prefer a complete, reliable core journey over extra features.

## Intended stack

- Next.js App Router and TypeScript
- Server-side Route Handlers under `app/api`
- SQLite and Drizzle ORM
- Zod for request and form validation
- Shadcn UI preset `b7kBsBkh7b`
- Vitest for unit tests
- Playwright for the end-to-end purchase journey
- pnpm for package management

The supplied Shadcn preset uses Nova styling, a zinc base, green theme, Instrument Sans headings, Geist Mono body text, Remix icons, and medium radius.

## Engineering rules

- Keep server-only database code out of client bundles.
- Validate all API inputs on the server, even if the form also validates in the browser.
- Store money as integer cents; format it as LKR only at presentation boundaries.
- Never integrate a real payment provider or store real card details.
- Make payment simulation deterministic so success and failure can both be demonstrated reliably.
- Persist completed orders and their line items in SQLite.
- Keep the cart client-side until checkout; do not add authentication for the MVP.
- Use Server Components by default and add `"use client"` only where interaction requires it.
- Prefer small, focused components and descriptive domain names over generic abstractions.
- Do not add optional features until FR1-FR6 pass end-to-end.

## Required validation

Before marking work complete, run the available equivalents of:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

If the scaffold has not yet defined one of these commands, document that fact in `STATUS.md`; do not claim it passed.

## AI-assisted workflow evidence

The development process is assessed as heavily as the final implementation. For each meaningful change:

- Record the prompt or a concise prompt summary.
- Record important AI output that was rejected or corrected.
- Record validation performed after accepting generated code.
- Capture screenshots at useful milestones.
- Update `STATUS.md` with progress, verification, decisions, and blockers.
- Track hands-on time honestly from the moment implementation begins.

Do not invent prompt history, test results, screenshots, timing, or completed functionality.

## Working agreement

Read `AGENTS.md` and `STATUS.md` before changing code. Preserve existing user work, keep changes scoped to the active issue, and leave the repository in a reproducible state.
