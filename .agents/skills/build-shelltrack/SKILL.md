---
name: build-shelltrack
description: Apply ShellTrack's product, design, writing, localization, data, and iteration rules. Use whenever reviewing, designing, coding, testing, or documenting ShellTrack, especially for interface text, dates, times, numbers, measurements, responsive screens, local storage, imports, exports, or iteration planning.
---

# Build ShellTrack

Keep ShellTrack calm, practical, local-first, and easy to understand.

## Start every task

1. Read `AGENTS.md` and the relevant files in `docs/`.
2. Confirm the active iteration and stay within its approved scope.
3. Preserve the data rules in `docs/data-model.md`.
4. Use the Stitch mockups as a visual guide, then fix unclear or inaccessible details.
5. Do not start a development or production server unless the user asks.

## Write naturally

- Prefer short, familiar words in interface text and documentation.
- Explain necessary technical terms in plain language.
- Avoid stiff, promotional, or AI-sounding phrases.
- Avoid em dashes in sentences. Use a full stop, comma, colon, or parentheses instead.
- Keep labels direct and helpful. Describe what an action does.

## Prepare every screen for translation

- Keep user-facing text in the message files under `lib/i18n/messages/`.
- Use stable message names based on meaning, not the current English sentence.
- Do not build sentences by joining translated fragments.
- Use named values for changing content such as pet names, dates, or counts.
- Include labels, help text, validation messages, errors, empty states, notifications, accessibility text, and page metadata.
- Allow room for translated text to grow. Do not rely on fixed text widths.
- Use `Intl` through shared helpers for dates, times, numbers, and units.
- Keep stored values unchanged: ISO strings for dates, grams for weight, and millimeters for shell dimensions.
- Treat calendar dates separately from exact moments so time zones do not change the chosen day.
- Never use string slicing or manual separators to format dates or numbers.
- Ship English first. Do not add a translation library or language picker until an approved iteration needs one.

## Protect product rules

- Require weight for every measurement.
- Keep shell length, width, and height independently optional.
- Never turn a missing measurement into zero.
- Keep Iteration 1 free from accounts, cloud storage, billing, and SaaS features.
- Prefer small changes and shared helpers over early frameworks or broad abstractions.

## Keep screens inside the viewport

- Design mobile-first and support 320, 390, 430, 640, and 768px widths.
- Never let a child widen the document. Contain wide tables, charts, and controls in their own scroller or replace them with a mobile layout.
- Keep browser pinch zoom available. Never use `user-scalable=no` or a restrictive maximum scale as a layout fix.
- Add every new screen or major overlay to `tests/e2e/viewport.spec.ts` and assert that document width does not exceed viewport width.

## Finish carefully

- Update tests and project guides when a shared rule changes.
- Update `docs/changelog.md` for meaningful user or contributor changes.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` without starting a server.
- Run the relevant Playwright viewport checks when a development server is explicitly available.
