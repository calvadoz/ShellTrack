# Iteration Plan

## Foundation: active

- Configure Next.js, TypeScript, Tailwind CSS, shadcn/ui, ESLint, Prettier, Vitest, and Playwright.
- Set up folders, shared design styles, brand assets, loading feedback, tests, and contributor notes.
- Centralize English interface text and add shared formatters so future translations do not require a rewrite.
- Do not add pet editing or data storage yet.

## Local-first MVP: requires approval

- Add pet and measurement screens with Dexie and IndexedDB for device storage.
- Add validation, unit conversion, dashboard, pet details, charting, history, and responsive forms.
- Add versioned JSON import/export and measurement CSV export.
- Test that a measurement works with only a date and weight.

## Optional cloud follow-up: requires approval

- Add optional Supabase sign-in and protected cloud storage while keeping local mode available without an account.
- Let the user choose when to copy local data to the cloud, using a simple guided process.

## Polish and reliability: requires approval

- Improve accessibility, mobile layouts, loading and error messages, empty states, import safety, cloud behavior, documentation, and tests.

## Final review: requires approval

- Review code quality, security, data safety, ease of use, release readiness, and the most useful next step without adding a new group of features.
