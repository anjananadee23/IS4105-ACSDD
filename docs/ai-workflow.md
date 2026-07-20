# AI-Assisted Workflow Log

Use this log to capture how AI assistants contributed to CeylonCart and how their output was reviewed. Add an entry after each meaningful change. Keep prompt text or a faithful summary, but never add evidence retrospectively from memory when it cannot be verified.

## Evidence rules

- Record the assistant/tool used, the human intent, and the affected issue or requirement.
- Summarise the accepted output and any rejected approach or human correction.
- Record only validation that was actually run, including failures.
- Store screenshots in the assignment evidence location chosen by the team and link them here.
- Do not include secrets, real customer data, or real payment information.

## Session log

No implementation sessions have been recorded yet.

Copy this section for each meaningful session:

### TODO: Session title

- Date/time: TODO
- Assistant/tool: TODO
- GitHub issue or requirement: TODO
- Goal: TODO
- Prompt or faithful prompt summary: TODO
- AI-proposed approach: TODO
- Output accepted: TODO
- Output rejected or corrected by the developer: TODO
- Human reasoning/decision: TODO
- Files changed: TODO
- Validation executed and result: TODO
- Evidence link(s): TODO
- Follow-up: TODO

## Decision and correction index

Use this table to make engineering judgement easy to locate in the final report.

| Date | Issue/requirement | AI suggestion | Human decision or correction | Evidence |
| --- | --- | --- | --- | --- |
| TODO | TODO | TODO | TODO | TODO |

## Suggested evidence milestones

- Project scaffold and reproducible local start.
- SQLite schema, migration, and seeded catalogue.
- Catalogue and product-details flow.
- Cart calculations and quantity controls.
- Checkout validation and server-derived totals.
- Deterministic payment success, failure, and retry.
- Persisted order confirmation with generated order ID.
- Unit, integration, end-to-end, build, and CI results.
- A rejected AI approach or meaningful human correction.

