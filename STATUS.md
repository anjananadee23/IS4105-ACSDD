# CeylonCart Status

Last updated: 2026-07-20

## Current phase

Database layer, product catalogue, product details, client-side cart (FR1-FR3), checkout, simulated payment, and confirmation (FR4-FR6) are implemented and validated. Automated e2e coverage and final polish are next.

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
- Added the SQLite/Drizzle schema, generated migration, repeatable 12-product seed, and database tests.
- Built the responsive product catalogue (`/`), reading live from SQLite via the product repository, with loading/empty/error states (FR1, issue #3).
- Built the product details page (`/products/[slug]`) with an accessible quantity input, add-to-cart action, and a proper not-found state for unknown slugs (FR2, issue #4).
- Built the client-side, localStorage-persisted cart (`/cart`) with quantity edit, remove, empty-cart state, and integer-cent subtotal display; totals are display-only and will be recalculated server-side at checkout (FR3, issue #5).
- Added shadcn components (card, badge, separator, sheet, input, label, sonner, skeleton) and generated local SVG placeholder images for all 12 seeded products.
- Generated and replaced local SVG placeholders with 12 high-quality, professional PNG images generated using AI image generator, saved under `/public/img/`, and successfully linked to the SQLite database via updated product seed values.
- Built server-side checkout (`/checkout`, `POST /api/checkout`): manually-validated customer/delivery/payment input (no Zod dependency was added; validation lives in `lib/validation/checkout.ts`), server-side re-pricing of cart lines from current product data and stock (`lib/db/order-repository.ts`), and persistence of the order plus line items in SQLite within a single transaction (FR4, issue #6).
- Built a deterministic simulated payment gateway (`lib/payments/simulate.ts`): card `4000000000000002` always declines (documented retry demo), any other 16-digit dummy card succeeds with a generated transaction reference; no real card data is ever persisted (FR5, issue #7).
- Built the order confirmation page (`/order/[orderNumber]`) showing the order summary, generated order ID, and delivery details for both successful and declined outcomes, with a not-found state for unknown order numbers and a "try a different card" retry path on decline (FR6, issue #7).
- Wired the cart's "Proceed to checkout" button to the new checkout page.
- Fixed `lib/db/seed.ts`: the delete-then-insert reseed strategy broke with a foreign-key violation as soon as any order referenced a seeded product (and `predev`/`prebuild` now run `db:setup` on every start, so this would have broken `pnpm dev` for every developer after their first test order). Replaced it with an upsert (`onConflictDoUpdate`) that refreshes name/price/description/image/category/featured but deliberately leaves `stock` untouched, so reseeding never undoes real inventory decrements from completed orders. Added a regression test covering reseed-after-order.
- Built premium search and category filtering interface (`/`) with a 300ms debounced search input and responsive, horizontal category selector pills.


## Not started

- Automated Playwright/e2e coverage and GitHub Actions workflow (issues #8-#9).
- Assignment screenshots, screen recording, and final report.

## Blockers

None at this checkpoint.

## Next recommended actions

1. Add Playwright/unit coverage for checkout and payment (issue #8) and wire up GitHub Actions (issue #9).
2. Keep the hands-on time log current during implementation.
3. Optional: user login/registration and a basic admin order view are listed as optional extensions in the assignment brief (attempt only after FR1-FR6 are demoable).

## Validation status

- `pnpm db:setup`: passed; created/migrated the SQLite database and seeded 12 products.
- repeated `pnpm db:seed`: passed; product count remained 12, stock preserved after an order exists.
- `pnpm test`: passed (4 tests, including a new reseed-after-order regression test).
- `pnpm lint`: passed.
- `pnpm typecheck`: passed.
- `pnpm build`: passed.
- Manual check via `curl` against the dev server: `POST /api/checkout` returns 201 + `confirmed` status with a valid dummy card, and 402 + `payment_failed` status with the documented failing card `4000000000000002`; `GET /order/[orderNumber]` renders both outcomes correctly and 404s for an unknown order number.

## Hands-on development time

Database layer plus catalogue/details/cart implementation session recorded on 2026-07-20.

## Decision log

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-07-20 | Use Next.js with server-side Route Handlers | Matches the requested stack and keeps the MVP in one application. |
| 2026-07-20 | Use SQLite with Drizzle | Provides simple local persistence and a small, explicit schema. |
| 2026-07-20 | Keep the cart client-side until checkout | Avoids unnecessary authentication/session infrastructure. |
| 2026-07-20 | Use deterministic simulated payments | Makes both success and failure outcomes reliable in tests and recordings. |
| 2026-07-20 | Defer optional features | The assignment explicitly prioritizes a complete FR1-FR6 journey. |
