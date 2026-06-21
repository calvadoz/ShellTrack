# ShellTrack Design Direction

## Source and intent

The supplied Stitch archive is the visual starting point. Its “Steadfast Care” style stays: modern, calm, inspired by nature, and clear enough for growth records without feeling clinical. When mockups disagree, use the refined version.

## Foundation

- Palette: warm cream backgrounds, deep forest green, muted olive, and small touches of soft gold.
- Type: Montserrat for identity, headings, and important measurements; Inter for body and interface copy.
- Shape: 16px cards, 12px controls, and pills only for compact statuses.
- Layout: one fluid mobile column with 20px gutters; a centered 1280px desktop grid with 24px gutters. A desktop sidebar and mobile bottom navigation are planned for the MVP.
- Viewport: screens must never widen the page beyond the device. Wide content stays inside its own scroll container, while browser zoom remains available for accessibility.
- Regression coverage: every new screen and major overlay joins the viewport tour at 320, 390, 430, 640, and 768px before it is considered complete.
- Depth: gentle color layers, subtle borders, and soft shadows rather than hard outlines.
- Motif: faint shell patterns can support the brand, but they must never make text harder to read.

## Usability corrections to the mockups

- Remove all cloud backup, account plan, and cloud security claims until those features exist.
- Use clear labels and reliable date fields instead of dates that could be misunderstood.
- Show weight as the only required growth metric; label length, width, and height as optional independently.
- Include shell width in forms and records. Some mockups leave it out.
- Do not use `0` for a missing dimension. Show `—` or a clear empty state.
- Keep text and controls easy to see, and make keyboard focus visible.
- Make touch targets at least 44px high, label unclear icons, and confirm before deleting anything.
- Treat charts as summaries. Support them with readable labels, tables, and empty states.
- Plot every weight record with date and weight axes and a readable legend. Keep dense histories legible with a limited set of visible markers and one large touch or keyboard surface that selects the nearest record. Mark a drop of 10% or more from the immediately previous record in red as a comparison cue, not a health judgment.
- Show measurement history as compact cards on phones and small tablets, with date, weight, recorded dimensions, and labeled actions. Use a contained table on larger screens and keep its action column visible during horizontal scrolling.
- Do not show unsupported health judgments, growth percentiles, or generic care advice as facts.
- Avoid a persistent preloader; the animated mark appears only during genuine route loading.
- Keep unresolved local queries distinct from empty data. Show a calm status loader until device storage is ready, then show either records or the true empty state.

## Motion

Use short fades, small lifts, and helpful loading feedback. Avoid looping animation except for the page loader. Respect the user's reduced-motion setting.

## Language and regional formats

- Keep interface text in shared message files instead of placing English sentences directly inside components.
- Write short, natural labels and avoid technical wording where a familiar phrase works.
- Allow buttons, cards, tables, and navigation labels to grow when translated.
- Use shared formatters for dates, times, numbers, weights, and lengths. Do not manually add separators or unit labels.
- Keep saved values in ISO format, grams, and millimeters. A user's language and region only change how those values appear.
- Treat a calendar date differently from an exact time so changing time zones does not change the selected day.

## Brand mark

The favicon and loader share a simple shell mark. It stays recognizable at small sizes without needing a detailed tortoise illustration.
