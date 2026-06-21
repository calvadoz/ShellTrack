# Changelog

## 2026-06-21

### Added

- Local pet profiles and measurement journals saved in IndexedDB through Dexie.
- Create, edit, and confirmed delete flows for pets and measurements, with transactional linked-record deletion.
- Responsive desktop and mobile navigation, pet dashboard, weight chart, and accessible measurement history.
- Strict record validation and weight or length unit conversion at the interface boundary.
- Versioned JSON backup and validated atomic import, plus measurement CSV export.
- A confirmed Data-menu action that deletes all pets and measurements stored locally by ShellTrack without affecting downloaded backups.
- One-time default profiles for Debbie and Jake with 276 supplied measurements, normalized gram storage, and documented source-date corrections.
- Unit and storage coverage for weight-only measurements, missing optional dimensions, cascade deletion, conversion, and portable formats.
- Initial Next.js App Router foundation with TypeScript, Tailwind CSS, shadcn/ui conventions, ESLint, Prettier, Vitest, and Playwright.
- Responsive welcome page based on the supplied Stitch design.
- Shared shell mark, favicon, and reduced-motion-aware route preloader.
- Guides for contributors, design choices, data rules, planned iterations, and future Codex work.
- A ShellTrack-only development skill with the project's product, writing, and localization rules.
- Shared English message files and locale-aware formatters for calendar dates, exact times, numbers, weight, and length.

### Changed

- Estimated age now advances from the pet's age at its first measurement to the latest record date using a 365.2425-day average year.
- Marked the local-first MVP as Iteration 2 and clarified calendar dates, audit timestamps, local UUIDs, and deferred pet photos.
- Updated the mockup plan to keep the first version on the device, make shell dimensions optional, show missing values clearly, and remove cloud or health claims that the app cannot support yet.
- Reworded the welcome page and project guides to sound clearer and more natural.
- Moved interface text and page metadata into shared messages so future translations can be added without rewriting components.

### Corrected

- Aligned Add Measurement with the approved Add Pet mobile modal: the same header, 20px gutters, field sizing, optional labels, plain form rhythm, and Cancel or Save actions, with shell dimensions compactly collapsed until needed.

### Known Issues

- Pet photos remain deferred until durable local image storage is designed.
- Records are tied to the current browser profile unless the user downloads and imports a JSON backup.
