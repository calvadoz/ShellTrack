# ShellTrack

ShellTrack is a private pet growth tracker that keeps data on your device. It starts with tortoise care, with room to support other pets later.

## Current status

Iteration 1 sets up the project and its visual foundation. Adding pets, recording measurements, saving browser data, charts, and import or export will come in the next approved iteration.

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

- Iteration 1 keeps everything on the device. It does not include accounts, cloud storage, billing, or online services.
- Measurement weight is required and stored internally in grams.
- Shell length, width, and height are optional and stored internally in millimeters.
- Dates use the ISO format, and the app creates IDs on the device during the first product iteration.
- English is the first language, with shared message and formatting helpers ready for future translations.

See `AGENTS.md` and the `docs/` folder for the design choices, data rules, and iteration plan.
