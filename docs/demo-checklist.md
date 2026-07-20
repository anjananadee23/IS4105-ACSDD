# CeylonCart Demo and Evidence Checklist

Use this checklist to prepare the screen recording and assignment evidence. Items are intentionally unchecked: implementation, validation, screenshots, and recording have not yet been verified.

## Before recording

- [ ] Confirm FR1-FR6 work end-to-end on a clean local setup.
- [ ] Use only dummy customer and payment details.
- [ ] Seed 8-12 products and confirm local/licensed images render.
- [ ] Confirm the documented payment-success input.
- [ ] Confirm the documented payment-failure input and retry path.
- [ ] Clear irrelevant browser tabs, notifications, and sensitive terminal history.
- [ ] Choose readable browser zoom and viewport sizes.
- [ ] Record the commit hash/version being demonstrated: TODO.
- [ ] Record the demo date: TODO.

## Mandatory product journey

- [ ] FR1: Show the catalogue with 8-12 products, names, prices, and images.
- [ ] FR2: Open an individual product and show its details.
- [ ] FR3: Add a product to the cart, change quantity, remove an item, and verify totals.
- [ ] FR4: Complete customer and delivery fields and show useful validation feedback.
- [ ] FR5: Demonstrate a deterministic failed payment and a successful retry without real card data.
- [ ] FR6: Show the confirmation page with generated order ID and order summary.
- [ ] Refresh or query through an approved interface to demonstrate that the completed order persists.
- [ ] Show responsive behaviour at desktop and mobile widths.

## Engineering workflow evidence

- [ ] Show the issue backlog and the issue associated with the demonstrated work.
- [ ] Capture representative AI prompts and outputs.
- [ ] Capture at least one rejected approach or human correction.
- [ ] Show a reviewed code diff or pull request.
- [ ] Show successful lint output.
- [ ] Show successful TypeScript type-check output.
- [ ] Show successful unit/integration test output.
- [ ] Show successful production build output.
- [ ] Show the Playwright happy-path result.
- [ ] Show the Playwright payment-failure/retry result.
- [ ] Show the GitHub Actions workflow result.
- [ ] Cross-check recorded time against `docs/time-log.md`.

## Suggested recording sequence

1. Briefly state the problem, constraints, architecture, and current commit.
2. Show issue-driven planning and selected AI-workflow evidence.
3. Run the customer journey from catalogue to confirmation.
4. Demonstrate payment failure and retry.
5. Show responsive layout and accessibility basics.
6. Show automated validation and CI evidence.
7. Close with limitations, human corrections, and honest time usage.

## Evidence inventory

Fill this table only after the artifacts exist.

| Artifact | Location/link | Captured on | Verified by |
| --- | --- | --- | --- |
| Screen recording | TODO | TODO | TODO |
| Catalogue/details screenshots | TODO | TODO | TODO |
| Cart/checkout screenshots | TODO | TODO | TODO |
| Payment failure/success screenshots | TODO | TODO | TODO |
| Confirmation screenshot | TODO | TODO | TODO |
| AI prompt/review screenshots | TODO | TODO | TODO |
| Local validation output | TODO | TODO | TODO |
| GitHub Actions result | TODO | TODO | TODO |

## Final safety and submission check

- [ ] No secrets, real personal data, or real card details appear in artifacts.
- [ ] No unverified test or implementation claims are included.
- [ ] All links and media open from the final submission.
- [ ] The recording is within the required duration and format: TODO—confirm against the assignment brief.
- [ ] The repository setup instructions work from a fresh checkout.
- [ ] Known limitations are stated accurately.
