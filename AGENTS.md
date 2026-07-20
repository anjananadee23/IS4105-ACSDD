# AGENTS.md

This file defines the shared working agreement for Codex, Claude, Antigravity developers, and other contributors to CeylonCart. It applies to the entire repository.

## Read before working

1. Read `CLAUDE.md` for product constraints and architecture.
2. Read `STATUS.md` for the latest verified state and current blocker.
3. Inspect the active GitHub issue, when available, and keep the change within its acceptance criteria.
4. Inspect the worktree before editing; never overwrite unrelated changes.

## Product priorities

Work in this order:

1. Project scaffold and reproducible local setup.
2. Database schema and seeded product data.
3. Catalogue and product details.
4. Shopping cart.
5. Checkout and order creation.
6. Simulated payment and confirmation.
7. Automated validation and GitHub Actions.
8. Responsive polish and optional extensions.

All mandatory assignment requirements FR1-FR6 must work before category filtering, admin pages, or authentication are considered.

## Implementation conventions

- Use TypeScript with strict typing; avoid `any` unless a documented integration boundary requires it.
- Prefer Next.js Server Components and server-side data access.
- Route Handlers should be thin: parse input, call a domain/service function, and return a consistent response.
- Place database access in server-only modules.
- Store prices and totals as integer cents.
- Derive order totals on the server from current product data; never trust totals supplied by the browser.
- Use semantic HTML and accessible labels for every interactive control.
- Keep the interface minimal, responsive, and consistent with the supplied Shadcn preset.
- Use local or explicitly licensed placeholder product images; do not depend on fragile remote image URLs.
- Never use real customer, contact, or payment information in fixtures, screenshots, or tests.

## Payment simulation

The fake gateway must be deterministic and safe for demonstrations. A documented test input should produce failure; other valid dummy input should produce success. The server may retain only the outcome and a fake transaction reference, never card data.

## Testing expectations

- Unit-test pricing, quantities, validation, order IDs, and payment outcomes.
- Integration-test API behavior and database persistence where practical.
- Maintain one Playwright happy path covering catalogue through confirmation.
- Maintain one payment failure test that confirms a retry is possible.
- Run linting, type checking, tests, and a production build before declaring a task complete.

Never report a check as passing unless it was executed successfully in the current workspace.

## Git and GitHub

- Use one focused issue per coherent deliverable.
- Branch names should be concise, such as `feat/catalogue` or `chore/ci`.
- Commit messages should describe the outcome, not the tool used.
- Pull requests must reference their issue and include testing evidence.
- CI should install with a frozen lockfile, lint, type-check, test, and build.
- Do not commit generated databases, environment secrets, Playwright artifacts, or dependency directories.

## Antigravity developer guidance

When working through Antigravity:

- Start from the active issue and provide the agent with its acceptance criteria.
- Ask for a short plan before broad or cross-cutting edits.
- Review generated diffs before accepting them.
- Validate generated code with the repository commands rather than relying on the agent's explanation.
- Capture representative prompt and review screenshots for the assignment report.
- Record rejected approaches and human corrections; these are valuable workflow evidence.
- Update `STATUS.md` at handoff so the next developer can continue without reconstructing context.

## Documentation and handoff

Every handoff should update `STATUS.md` with:

- What changed.
- What is verified.
- What remains.
- Any blocker or risk.
- The next recommended action.
- Hands-on time added, if implementation work occurred.

Keep documentation factual. Do not fabricate development evidence after the fact.
