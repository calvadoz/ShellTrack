# ShellTrack

ShellTrack is a private pet growth tracker that keeps data on your device. It starts with tortoise care, with room to support other pets later.

## Current status

Iteration 2 is a working local-first MVP. It saves pets and measurements in this browser, shows growth history, and supports JSON backups and measurement CSV export.

## Stack

- Next.js App Router and TypeScript
- Tailwind CSS and shadcn/ui conventions
- ESLint and Prettier
- Vitest and Testing Library
- Playwright
- pnpm

## Local development

Requires Node.js 20 or newer and pnpm 9.15.5.

```bash
corepack enable
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm format
```

Playwright browsers may need to be installed once with `pnpm exec playwright install`.

## Product rules

- Iteration 2 keeps everything on the device. It does not include accounts, cloud storage, billing, or online services.
- Measurement weight is required and stored internally in grams.
- Shell length, width, and height are optional and stored internally in millimeters.
- Calendar dates use `YYYY-MM-DD`, audit times use full ISO strings, and IDs are created on the device.
- English is the first language, with shared message and formatting helpers ready for future translations.

See `AGENTS.md` and the `docs/` folder for the design choices, data rules, and iteration plan.
