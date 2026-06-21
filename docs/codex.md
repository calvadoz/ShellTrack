# Codex Working Notes

## Working one step at a time

Work one approved iteration at a time. Read `AGENTS.md`, `docs/data-model.md`, `docs/design.md`, and `docs/iteration-plan.md` before making architectural changes.

## Current scope

Iteration 1 only sets up the project. The welcome page shows the main colors, type, responsive layout, brand mark, and animation style. It is not the product dashboard.

## Reference artifacts

The original Stitch ZIP remains the visual reference. Keep agreed design choices in `docs/design.md` so future work does not rely on generated HTML or copied mockup code.

## Decision order

1. Protect the product's important data rules.
2. Stay within the approved iteration.
3. Prefer accessible, understandable interactions.
4. Follow the visual baseline where it supports usability.
5. Keep the code as simple as the current work allows.

## Verification

Before finishing an iteration, run lint, TypeScript, and unit tests. Run Playwright when the work changes pages or important interactions.
