# Frontend Cleanup Audit

**Date:** 2026-07-06
**Scope:** `resources/css/**`, `resources/views/**` (Antlers templates & partials).
**Nature:** Read-only audit — findings only, **no code changed yet**. Each concern has
its own doc with file:line citations and concrete recommendations.

This audit was requested to check four areas (plus whatever else turned up). The short
version: the **CSS and JS are already in good shape** (a prior refactor — see
[`../frontend-refactor.md`](../frontend-refactor.md) — did most of the work). The real
leverage is in the **Antlers templates**: repeated HTML that was never componentized, a
partials folder whose organizing principle drifts, and a heading component that leaks.

---

## The four concerns

| # | Concern | Verdict | Doc |
|---|---|---|---|
| 1 | CSS should use Tailwind classes instead of vanilla CSS | **Mostly already done.** ~4 tiny wins left; the rest *must* stay vanilla (keyframes, `@font-face`, media queries, `::marker`). | [`01-css-tailwind.md`](./01-css-tailwind.md) |
| 2 | Clean up Antlers templates — same HTML without proper components | **Biggest win.** ~15 duplicated `<picture>` blocks, 5+ inline arrow-CTAs, duplicated contact-link pairs, near-identical teaser partials. | [`02-antlers-duplication.md`](./02-antlers-duplication.md) |
| 3 | Partials/components structure feels like a mess | **Real, but purely organizational.** The wiring is sound; the *shelving* mixes 4 different organizing principles. | [`03-partials-structure.md`](./03-partials-structure.md) |
| 4 | Heading components (h1/h2/h3) used all over with variants | **Leaky component.** 3 competing styling channels; 20/25 callers patch via one-off `class=""`; 13 templates bypass the component entirely. | [`04-headings.md`](./04-headings.md) |

## Also found (not in the original four)

These surfaced during the audit and are captured in [`05-additional-findings.md`](./05-additional-findings.md):

- **10 genuinely dead partials** (zero references — verified).
- **Latent CSS bug:** `opacity: 100 !important` in `fadeIn.css` (should be `1`).
- **Path inconsistency:** `project/index.antlers.html` uses a redundant `partial:partials/...`
  prefix (6×) where the rest of the codebase uses `partial:components/...`.
- **h1 `is_project` branch drops `{{ class }}`** — a latent bug waiting for the first caller
  that passes a class in project mode.

---

## Suggested order of work

Ordered by leverage-per-risk. Each is independent; do them as separate commits/PRs.

1. **Delete dead partials** ([05](./05-additional-findings.md)) — pure removal, zero risk, instant tidy.
2. **Fix the two latent bugs** ([05](./05-additional-findings.md)) — `opacity: 100`, h1 `{{ class }}` drop.
3. **Reuse existing button/contact components** for the 5+ inline arrow-CTAs ([02](./02-antlers-duplication.md), finding #2) — pure reuse, no new abstraction.
4. **Extract the `<picture>` component** ([02](./02-antlers-duplication.md), finding #1) — biggest single dedup; ~11 copies removed.
5. **Extract `contact-links` + `overlay-caption` + `section` wrappers** ([02](./02-antlers-duplication.md), #3/#5/#9).
6. **Tame the heading component** ([04](./04-headings.md)) — turn the duplicated `class=""` strings into real variants; decide the CSS-vs-component boundary.
7. **Reorganize the partials tree** ([03](./03-partials-structure.md)) — do this **last**, as one mechanical move-and-update-includes pass, after the dedup work has already reduced the file count.

> Verification caveat (same as prior docs): this machine can't serve the multisite app
> locally. All findings are from static analysis + grep verification. Any change should get
> a smoke check on staging for the affected pages.
