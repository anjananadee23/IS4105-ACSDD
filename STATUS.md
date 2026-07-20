# CeylonCart Status

Last updated: 2026-07-20

## Current phase

Initial scaffold published; application feature implementation is starting.

## Confirmed scope

- Product: CeylonCart, a storefront for locally made Sri Lankan products.
- Mandatory journey: catalogue -> details -> cart -> checkout -> simulated payment -> confirmation.
- Stack: Next.js App Router, TypeScript, server-side Route Handlers, SQLite, Drizzle, Zod, and pnpm.
- Design: Shadcn preset `b7kBsBkh7b`, kept minimal and responsive.
- Quality: linting, type checking, unit tests, Playwright, production build, and GitHub Actions.

## Completed

- Reviewed the three-page assignment brief.
- Identified mandatory requirements FR1-FR6 and the three-hour hands-on limit.
- Inspected the supplied Shadcn preset and confirmed its Next.js initialization command.
- Added GitHub issue templates, pull request template, and label definitions.
- Added AI/contributor guidance in `CLAUDE.md` and `AGENTS.md`.
- Initialized the Next.js/Shadcn application at the repository root.
- Connected `anjananadee23/IS4105-ACSDD` and created issues #1-#11.
- Added contributor and evidence-capture documentation.

## Not started

- Database schema, migrations, and seed data.
- Application features.
- Automated tests and GitHub Actions workflow.
- Assignment screenshots, screen recording, and final report.

## Blockers

None at this checkpoint.

## Next recommended actions

1. Initialize the Next.js project using:

   ```bash
   pnpm dlx shadcn@latest init --preset b7kBsBkh7b --template next
   ```

2. Initialize Git and connect the intended GitHub repository.
3. Create the implementation issues in dependency order.
4. Start the hands-on timer.
5. Implement and verify the scaffold/database issue first.

## Validation status

No application validation commands are available yet because the project has not been scaffolded.

## Hands-on development time

Not started. Planning and assignment analysis have occurred, but no application implementation time has been recorded yet.

## Decision log

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-07-20 | Use Next.js with server-side Route Handlers | Matches the requested stack and keeps the MVP in one application. |
| 2026-07-20 | Use SQLite with Drizzle | Provides simple local persistence and a small, explicit schema. |
| 2026-07-20 | Keep the cart client-side until checkout | Avoids unnecessary authentication/session infrastructure. |
| 2026-07-20 | Use deterministic simulated payments | Makes both success and failure outcomes reliable in tests and recordings. |
| 2026-07-20 | Defer optional features | The assignment explicitly prioritizes a complete FR1-FR6 journey. |
