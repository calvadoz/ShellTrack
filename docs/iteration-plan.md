# Iteration Plan

## Iteration 1, Foundation: complete

- Configure Next.js, TypeScript, Tailwind CSS, shadcn/ui, ESLint, Prettier, Vitest, and Playwright.
- Set up folders, shared design styles, brand assets, loading feedback, tests, and contributor notes.
- Centralize English interface text and add shared formatters so future translations do not require a rewrite.
- Do not add pet editing or data storage yet.

## Iteration 2, Local-first MVP: complete

- Save pet profiles and measurements in IndexedDB through Dexie.
- Support creating, editing, and deleting pets and measurements, including transactional deletion of a pet's linked measurements.
- Validate stored records and convert display units while keeping grams and millimeters in storage.
- Provide a responsive pet dashboard, pet journals, a weight chart, and an accessible measurement history table.
- Provide versioned JSON backup and atomic replacement import, plus measurement CSV export.
- Let the user delete all local ShellTrack data after an explicit confirmation.
- Seed Debbie and Jake once in a new empty database, with their supplied measurement histories and derived age estimates.
- Test that a measurement works with only a calendar date and weight.
- Pet photos are deferred until durable local image storage is designed and approved.

## Optional cloud follow-up: requires approval

- Add optional Supabase sign-in and protected cloud storage while keeping local mode available without an account.
- Let the user choose when to copy local data to the cloud, using a simple guided process.

## Polish and reliability: requires approval

- Improve accessibility, mobile layouts, loading and error messages, empty states, import safety, cloud behavior, documentation, and tests.

## Final review: requires approval

- Review code quality, security, data safety, ease of use, release readiness, and the most useful next step without adding a new group of features.
